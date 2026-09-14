import assert from 'node:assert/strict';
import { test } from 'node:test';
import { needlemanWunsch, needlemanWunschConsensus } from '../src/services/needleman-wunsch';
import { SimulationService } from '../src/services/simulation.service';
import { SimulationController } from '../src/controllers/simulation.controller';
import { SavedSimulationModel } from '../src/models/saved-simulation.model';
import { DnaBase, RecoveryAlgorithm } from '../src/models/simulation.models';
const dna = (value: string) => value.split('') as DnaBase[];
const service = new SimulationService();

test('global alignment returns expected scores and preserves input through traceback', () => {
  for (const [a, b, score] of [['ATCG','ATCG',8], ['ATCG','AACG',5], ['ATCG','ATTCG',6], ['ATCG','ACG',4], ['','ATCG',-8], ['','',0]] as const) {
    const aligned = needlemanWunsch(dna(a), dna(b));
    assert.equal(aligned.score, score);
    assert.equal(aligned.a.filter(Boolean).join(''), a);
    assert.equal(aligned.b.filter(Boolean).join(''), b);
    assert.equal(aligned.a.length, aligned.b.length);
    const computed = aligned.a.reduce((total, base, i) => total +
      (base === null || aligned.b[i] === null ? -2 : base === aligned.b[i] ? 2 : -1), 0);
    assert.equal(computed, score);
  }
});

test('alignment consensus repairs substitutions, insertions and deletions', () => {
  for (const bad of ['TCAT','TAAAT','TAT']) {
    const reads = [bad, 'TAAT', 'TAAT'].map(dna);
    assert.deepEqual(needlemanWunschConsensus(reads), dna('TAAT'));
  }
});

test('alignment consensus reconstructs a sequence absent from all observed reads', () => {
  const reads = ['TTCG','AACG','ATAG','ATCA','ATTCG','ACG','ATC'].map(dna);
  assert.deepEqual(needlemanWunschConsensus(reads), dna('ATCG'));
  assert.deepEqual(needlemanWunschConsensus([...reads].reverse()), dna('ATCG'));
});

test('ties, invalid consensus length and complete dropout remain unresolved', () => {
  assert.equal(needlemanWunschConsensus(['AAAA','AAAT'].map(dna)), null);
  assert.equal(needlemanWunschConsensus(['AAA','AAA'].map(dna)), null);
  assert.equal(needlemanWunschConsensus([[],[]]), null);
  assert.equal(needlemanWunschConsensus([]), null);
  assert.deepEqual(needlemanWunschConsensus([[],dna('TAAT')]), dna('TAAT'));
});

test('both methods are deterministic and independent of reference metadata', () => {
  const source = service.encodeText('A');
  const reads = [{ ...source[0], bases: dna('TCAT'), reads: ['TCAT','TAAT','TAAT'].map(dna) }];
  const before = structuredClone(reads);
  const random = Math.random;
  Math.random = () => { throw new Error('No random calls during recovery'); };
  try {
    for (const algorithm of ['levenshtein-consensus','needleman-wunsch'] as RecoveryAlgorithm[]) {
      const result = service.recoverStrands(reads, source, algorithm);
      const poisoned = reads.map(s => ({ ...s, originalBases: dna('GGGG'), originalChar: 'Z' }));
      const other = service.recoverStrands(poisoned, service.encodeText('Z'), algorithm);
      assert.equal(result.algorithm, algorithm);
      assert.equal(result.recoveredText, 'A');
      assert.equal(other.recoveredText, 'A');
      assert.equal(other.successRate, 0);
      assert.equal(result.corrections, 1);
      assert.deepEqual(service.recoverStrands(reads, source, algorithm), result);
    }
    assert.deepEqual(reads, before);
  } finally { Math.random = random; }
});

test('API dispatches selected algorithm, defaults old clients, rejects unknown values', () => {
  const controller = new SimulationController(service);
  const source = service.encodeText('A');
  for (const algorithm of [undefined, 'levenshtein-consensus', 'needleman-wunsch', 'invalid', null]) {
    let status = 200; let body: any;
    const res = { status(code: number) { status = code; return this; }, json(value: unknown) { body = value; } };
    controller.recover({ body: { erroneousStrands: source, originalStrands: source, algorithm } } as any, res as any);
    if (algorithm === 'invalid' || algorithm === null) assert.equal(status, 400);
    else {
      assert.equal(status, 200);
      assert.equal(body.algorithm, algorithm ?? 'levenshtein-consensus');
      assert.equal(body.recoveredText, 'A');
    }
  }
});

test('saved results preserve the method, reconstructed strands and unresolved count', () => {
  const source = service.encodeText('A');
  const result = service.recoverStrands(source, source, 'needleman-wunsch');
  const doc = new SavedSimulationModel({ recoveryResult: result });
  assert.deepEqual(doc.toObject().recoveryResult, result);
  assert.equal(new SavedSimulationModel({}).toObject().recoveryResult, undefined);
});
