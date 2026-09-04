export type DnaBase = 'A' | 'T' | 'C' | 'G';

export type ErrorType = 'substitution' | 'insertion' | 'deletion' | 'burst' | 'dropout';

export type SimulationStep = 'input' | 'encoded' | 'errors' | 'recovered';

export interface DnaStrand {
  id: string;
  charIndex: number;
  originalChar: string;
  bases: DnaBase[];
  originalBases: DnaBase[];
  hasError: boolean;
  errorTypes: ErrorType[];
}

export interface ErrorEvent {
  type: ErrorType;
  strandIndex: number;
  position: number;
  originalBase?: DnaBase;
  newBase?: DnaBase;
  length?: number;
}

export interface SimulationConfig {
  enableSubstitution: boolean;
  enableInsertion: boolean;
  enableDeletion: boolean;
  enableBurst: boolean;
  enableDropout: boolean;
  errorRate: number;
  burstLength: number;
}

export interface SimulationMetrics {
  totalStrands: number;
  totalBases: number;
  errorCount: number;
  affectedStrands: number;
  errorRate: number;
  byType: Record<ErrorType, number>;
}

export interface RecoveryResult {
  strands: DnaStrand[];
  corrections: number;
  recoveredText: string;
  successRate: number;
}
