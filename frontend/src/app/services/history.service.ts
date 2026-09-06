import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SaveSimulationPayload,
  SavedSimulationDetail,
  SavedSimulationSummary,
} from '../models/history.models';

@Service()
export class HistoryService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:3000/api/history';

  save(payload: SaveSimulationPayload): Observable<SavedSimulationSummary> {
    return this.http.post<SavedSimulationSummary>(this.apiBase, payload);
  }

  list(): Observable<SavedSimulationSummary[]> {
    return this.http.get<SavedSimulationSummary[]>(this.apiBase);
  }

  getById(id: string): Observable<SavedSimulationDetail> {
    return this.http.get<SavedSimulationDetail>(`${this.apiBase}/${id}`);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBase}/${id}`);
  }
}
