import {
  DnaStrand,
  ErrorEvent,
  RecoveryResult,
  RecoveryAlgorithm,
  SimulationConfig,
  SimulationMetrics,
} from '../models/simulation.models';

export interface EncodeRequestBody {
  text: string;
}

export interface EncodeResponse {
  text: string;
  strands: DnaStrand[];
}

export interface SimulateErrorsRequestBody {
  strands: DnaStrand[];
  config: SimulationConfig;
}

export interface SimulateErrorsResponse {
  strands: DnaStrand[];
  events: ErrorEvent[];
  metrics: SimulationMetrics;
  decodedText: string;
}

export interface RecoverRequestBody {
  algorithm?: RecoveryAlgorithm;
  erroneousStrands: DnaStrand[];
  originalStrands: DnaStrand[];
}

export type RecoverResponse = RecoveryResult;
