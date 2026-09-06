import { DnaStrand, SimulationConfig } from "../models/simulation.models";

export interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface SaveSimulationRequestBody {
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
