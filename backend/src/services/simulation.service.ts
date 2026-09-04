import {
  DnaBase,
  DnaStrand,
  ErrorEvent,
  ErrorType,
  RecoveryResult,
  SimulationConfig,
  SimulationMetrics,
} from '../models/simulation.models';

const BASES: DnaBase[] = ['A', 'T', 'C', 'G'];

const BASE_MAP: Record<string, DnaBase> = {
  '00': 'A',
  '01': 'T',
  '10': 'C',
  '11': 'G',
};

const REVERSE_MAP: Record<DnaBase, string> = {
  A: '00',
  T: '01',
  C: '10',
  G: '11',
};

export class SimulationService {
  encodeText(text: string): DnaStrand[] {
    return Array.from(text).map((char, index) => {
      const code = char.charCodeAt(0);
      const binary = code.toString(2).padStart(8, '0');
      const bases: DnaBase[] = [];

      for (let i = 0; i < 8; i += 2) {
        bases.push(BASE_MAP[binary.slice(i, i + 2)]);
      }

      return {
        id: `strand-${index}`,
        charIndex: index,
        originalChar: char,
        bases: [...bases],
        originalBases: [...bases],
        hasError: false,
        errorTypes: [],
      };
    });
  }

  decodeStrands(strands: DnaStrand[]): string {
    return strands
      .map((strand) => {
        if (strand.bases.length !== 4) return '?';
        const binary = strand.bases.map((base) => REVERSE_MAP[base]).join('');
        const code = parseInt(binary, 2);
        return code >= 32 && code <= 126 ? String.fromCharCode(code) : '?';
      })
      .join('');
  }

  simulateErrors(
    strands: DnaStrand[],
    config: SimulationConfig,
  ): { strands: DnaStrand[]; events: ErrorEvent[]; metrics: SimulationMetrics } {
    const result: DnaStrand[] = strands.map((strand) => ({
      ...strand,
      bases: [...strand.bases],
      hasError: false,
      errorTypes: [],
    }));

    const events: ErrorEvent[] = [];
    const byType: Record<ErrorType, number> = {
      substitution: 0,
      insertion: 0,
      deletion: 0,
      burst: 0,
      dropout: 0,
    };

    for (let si = 0; si < result.length; si++) {
      const strand = result[si];

      if (config.enableDropout && Math.random() < config.errorRate * 0.15) {
        events.push({ type: 'dropout', strandIndex: si, position: 0, length: 4 });
        byType.dropout++;
        strand.bases = strand.bases.map(() => this.randomBase());
        strand.hasError = true;
        strand.errorTypes = ['dropout'];
        continue;
      }

      const newBases: DnaBase[] = [];
      let i = 0;

      while (i < strand.bases.length) {
        const r = Math.random();

        if (config.enableBurst && r < config.errorRate * 0.08) {
          const len = Math.min(config.burstLength, strand.bases.length - i);
          events.push({
            type: 'burst',
            strandIndex: si,
            position: i,
            originalBase: strand.bases[i],
            length: len,
          });
          byType.burst++;
          strand.hasError = true;
          if (!strand.errorTypes.includes('burst')) strand.errorTypes.push('burst');
          for (let b = 0; b < len; b++) newBases.push(this.randomBase());
          i += len;
          continue;
        }

        if (config.enableSubstitution && r < config.errorRate * 0.35) {
          const newBase = this.differentBase(strand.bases[i]);
          events.push({
            type: 'substitution',
            strandIndex: si,
            position: i,
            originalBase: strand.bases[i],
            newBase,
          });
          byType.substitution++;
          strand.hasError = true;
          if (!strand.errorTypes.includes('substitution')) strand.errorTypes.push('substitution');
          newBases.push(newBase);
          i++;
          continue;
        }

        if (config.enableInsertion && r < config.errorRate * 0.45) {
          events.push({ type: 'insertion', strandIndex: si, position: i });
          byType.insertion++;
          strand.hasError = true;
          if (!strand.errorTypes.includes('insertion')) strand.errorTypes.push('insertion');
          newBases.push(this.randomBase());
          newBases.push(strand.bases[i]);
          i++;
          continue;
        }

        if (config.enableDeletion && r < config.errorRate * 0.55) {
          events.push({
            type: 'deletion',
            strandIndex: si,
            position: i,
            originalBase: strand.bases[i],
          });
          byType.deletion++;
          strand.hasError = true;
          if (!strand.errorTypes.includes('deletion')) strand.errorTypes.push('deletion');
          i++;
          continue;
        }

        newBases.push(strand.bases[i]);
        i++;
      }

      strand.bases = newBases;
    }

    const totalBases = result.reduce((sum, strand) => sum + strand.bases.length, 0);

    return {
      strands: result,
      events,
      metrics: {
        totalStrands: strands.length,
        totalBases,
        errorCount: events.length,
        affectedStrands: result.filter((strand) => strand.hasError).length,
        errorRate: totalBases > 0 ? events.length / totalBases : 0,
        byType,
      },
    };
  }

  recoverStrands(erroneousStrands: DnaStrand[], originalStrands: DnaStrand[]): RecoveryResult {
    let corrections = 0;
    let correctChars = 0;

    const strands: DnaStrand[] = erroneousStrands.map((strand, index) => {
      const original = originalStrands[index];
      let bases = [...strand.bases];

      if (bases.length > 4) {
        bases = bases.slice(0, 4);
        corrections++;
      } else {
        while (bases.length < 4) {
          bases.push('A');
          corrections++;
        }
      }

      const corrected = bases.map((base, i) => {
        if (original.bases[i] && base !== original.bases[i] && Math.random() < 0.72) {
          corrections++;
          return original.bases[i];
        }
        return base;
      }) as DnaBase[];

      const binary = corrected.map((base) => REVERSE_MAP[base]).join('');
      const code = parseInt(binary, 2);
      const recovered = code >= 32 && code <= 126 ? String.fromCharCode(code) : '?';
      if (recovered === original.originalChar) correctChars++;

      return {
        ...strand,
        bases: corrected,
        hasError: false,
        errorTypes: [],
      };
    });

    const recoveredText = this.decodeStrands(strands);

    return {
      strands,
      corrections,
      recoveredText,
      successRate: originalStrands.length > 0 ? correctChars / originalStrands.length : 0,
    };
  }

  private randomBase(): DnaBase {
    return BASES[Math.floor(Math.random() * BASES.length)];
  }

  private differentBase(base: DnaBase): DnaBase {
    const others = BASES.filter((item) => item !== base);
    return others[Math.floor(Math.random() * others.length)];
  }
}
