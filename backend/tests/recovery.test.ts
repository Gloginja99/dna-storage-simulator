import assert from 'node:assert/strict';
import { test } from 'node:test';
import { consensus, levenshtein } from '../src/services/consensus';
import { SimulationService } from '../src/services/simulation.service';
import { SavedSimulationModel } from '../src/models/saved-simulation.model';
import { SimulationController } from '../src/controllers/simulation.controller';
import { DnaBase, SimulationConfig } from '../src/models/simulation.models';

const dna = (value: string) => value.split('') as DnaBase[];
const service = new SimulationService();
const config: SimulationConfig = {
  enableSubstitution: false, enableInsertion: false, enableDeletion: false,
  enableBurst: false, enableDropout: false, errorRate: 0, burstLength: 2,
};

test('Levenshtein counts substitutions, insertions and deletions', () => {
  assert.equal(levenshtein(dna('ATCG'), dna('ATCG')), 0);
  for (const changed of ['AACG', 'ATTCG', 'ACG']) {
    assert.equal(levenshtein(dna('ATCG'), dna(changed)), 1);
    assert.equal(levenshtein(dna(changed), dna('ATCG')), 1);
  }
  assert.equal(levenshtein([], dna('ATCG')), 4);
});

test('consensus reconstructs from only corrupted reads with mixed edit types', () => {
  const reads = ['TTCG', 'AACG', 'ATAG', 'ATCA', 'ATTCG', 'ACG', 'ATC'].map(dna);
  assert.deepEqual(consensus(reads), dna('ATCG'));
  assert.deepEqual(consensus([...reads].reverse()), dna('ATCG'));
});

test('majority repairs insertion and deletion in the displayed read', () => {
  for (const first of ['TAAAT', 'TAT']) {
    const original = service.encodeText('A');
    const noisy = [{ ...original[0], bases: dna(first), reads: [dna(first), dna('TAAT'), dna('TAAT')] }];
    const result = service.recoverStrands(noisy, original);
    assert.equal(result.recoveredText, 'A');
    assert.equal(result.corrections, 1);
    assert.equal(result.successRate, 1);
  }
});

test('ties and complete dropout are erasures', () => {
  assert.equal(consensus([dna('AAAA'), dna('AAAT')]), null);
  assert.equal(consensus([[], [], []]), null);
  assert.equal(consensus([]), null);
  const original = service.encodeText('A');
  const result = service.recoverStrands([{ ...original[0], bases: [], reads: [[], []] }], original);
  assert.equal(result.recoveredText, '?');
  assert.equal(result.unresolvedStrands, 1);
  assert.equal(result.successRate, 0);
  assert.equal(result.corrections, 0);
});

test('reconstruction ignores ground truth and never calls random', () => {
  const original = service.encodeText('A');
  const noisy = [{ ...original[0], bases: dna('TCAT'), reads: ['TCAT', 'TAAT', 'TAAT'].map(dna) }];
  const before = structuredClone(noisy);
  const random = Math.random;
  Math.random = () => { throw new Error('Random recovery is forbidden'); };
  try {
    const result = service.recoverStrands(noisy, original);
    const poisoned = noisy.map((strand) => ({ ...strand, originalBases: dna('GGGG'), originalChar: 'Z' }));
    const changed = service.recoverStrands(poisoned, service.encodeText('Z'));
    assert.equal(result.recoveredText, 'A');
    assert.equal(changed.recoveredText, result.recoveredText);
    assert.deepEqual(changed.strands[0].bases, result.strands[0].bases);
    assert.equal(changed.corrections, result.corrections);
    assert.equal(changed.successRate, 0);
    assert.deepEqual(service.recoverStrands(noisy, original), result);
    assert.equal(service.recoverStrands(noisy, []).recoveredText, 'A');
    assert.deepEqual(noisy, before);
  } finally { Math.random = random; }
});

test('legacy single-read substitutions cannot be repaired by looking at the original', () => {
  const original = service.encodeText('A');
  const noisy = [{ ...original[0], bases: dna('TCAT') }];
  const result = service.recoverStrands(noisy, original);
  assert.deepEqual(result.strands[0].bases, dna('TCAT'));
  assert.equal(result.successRate, 0);
  assert.equal(result.corrections, 0);
});

test('zero-error simulation generates independent arrays and round-trips ASCII', () => {
  const original = service.encodeText('Hello DNA!');
  const before = structuredClone(original);
  const simulation = service.simulateErrors(original, config);
  assert.equal(simulation.events.length, 0);
  assert.equal(simulation.strands[0].reads!.length, 7);
  assert.notEqual(simulation.strands[0].reads![0], simulation.strands[0].reads![1]);
  assert.notEqual(simulation.strands[0].bases, simulation.strands[0].reads![0]);
  const recovered = service.recoverStrands(simulation.strands, original);
  assert.equal(recovered.recoveredText, 'Hello DNA!');
  assert.equal(recovered.successRate, 1);
  assert.equal(recovered.corrections, 0);
  assert.deepEqual(original, before);
});

test('each copy is corrupted independently and dropout is an empty read', () => {
  const random = Math.random;
  let calls = 0;
  Math.random = () => calls++ === 0 ? 0 : 0.99;
  try {
    const simulation = service.simulateErrors(service.encodeText('A'), { ...config, enableDropout: true, errorRate: 1 });
    assert.deepEqual(simulation.strands[0].bases, []);
    assert.deepEqual(simulation.strands[0].reads![0], []);
    assert.deepEqual(simulation.strands[0].reads![1], dna('TAAT'));
    assert.equal(simulation.metrics.byType.dropout, 1);
    assert.equal(service.recoverStrands(simulation.strands, service.encodeText('A')).recoveredText, 'A');
  } finally { Math.random = random; }
});

test('evaluation matches source by ID and counts missing strands as failures', () => {
  const original = service.encodeText('AB');
  assert.equal(service.recoverStrands([...original].reverse(), original).successRate, 1);
  assert.equal(service.recoverStrands([original[0]], original).successRate, 0.5);
  assert.equal(service.recoverStrands([], []).successRate, 0);
});

test('MongoDB schema retains reads, including empty dropped reads, and supports legacy records', () => {
  const strand = { ...service.encodeText('A')[0], reads: [[], dna('TAAT')] };
  const doc = new SavedSimulationModel({ erroneousStrands: [strand] });
  assert.deepEqual(doc.toObject().erroneousStrands[0].reads, strand.reads);
  const legacy = new SavedSimulationModel({ erroneousStrands: service.encodeText('A') });
  assert.equal(legacy.toObject().erroneousStrands[0].reads, undefined);
});

test('recovery endpoint rejects invalid and oversized reads before reconstruction', () => {
  const controller = new SimulationController(service);
  const source = service.encodeText('A');
  for (const reads of [[dna('ATXG')], [dna('A'.repeat(9))], Array(8).fill(dna('TAAT')), []]) {
    let status = 200;
    const response = { status(code: number) { status = code; return this; }, json() {} };
    controller.recover({ body: { erroneousStrands: [{ ...source[0], reads }], originalStrands: source } } as any, response as any);
    assert.equal(status, 400);
  }
});


test('controller flow accepts the full UI burst range and returns consensus results', () => {
  const controller = new SimulationController(service);
  const source = service.encodeText('DNA');
  let status = 200;
  let body: any;
  const response = { status(code: number) { status = code; return this; }, json(value: unknown) { body = value; } };
  controller.simulateErrors({ body: { strands: source, config: { ...config, burstLength: 8 } } } as any, response as any);
  assert.equal(status, 200);
  assert.equal(body.strands[0].reads.length, 7);
  controller.recover({ body: { erroneousStrands: body.strands, originalStrands: source } } as any, response as any);
  assert.equal(status, 200);
  assert.equal(body.recoveredText, 'DNA');
  assert.equal(body.algorithm, 'levenshtein-consensus');
  assert.equal(body.successRate, 1);
});
