import { DnaStrand, SimulationConfig } from './simulation.models';

export interface SaveSimulationPayload {
  name: string;
  inputText: string;
  config: SimulationConfig;
  encodedStrands: DnaStrand[];
  erroneousStrands: DnaStrand[];
  erroneousText: string;
  recoveredText: string;
  corrections: number;
  successRate: number;
}

export interface SavedSimulationSummary {
  id: string;
  name: string;
  inputText: string;
  createdAt: string;
  successRate: number;
}

export interface SavedSimulationDetail extends SavedSimulationSummary {
  config: SimulationConfig;
  encodedStrands: DnaStrand[];
  erroneousStrands: DnaStrand[];
  erroneousText: string;
  recoveredText: string;
  corrections: number;
}
