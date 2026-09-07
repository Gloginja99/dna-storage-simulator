import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DnaStrand,
  ErrorEvent,
  SimulationConfig,
  SimulationMetrics,
} from '../models/simulation.models';

interface ErrorSimulationResponse {
  strands: DnaStrand[];
  events: ErrorEvent[];
  metrics: SimulationMetrics;
  decodedText: string;
}

@Service()
export class ErrorSimulator {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.backendUrl + '/api/simulation';

  simulate(strands: DnaStrand[], config: SimulationConfig): Observable<ErrorSimulationResponse> {
    return this.http.post<ErrorSimulationResponse>(`${this.apiBase}/errors`, { strands, config });
  }
}
