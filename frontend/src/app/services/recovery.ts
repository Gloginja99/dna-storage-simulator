import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DnaStrand, RecoveryResult } from '../models/simulation.models';

@Service()
export class Recovery {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.backendUrl + '/api/simulation';

  recover(erroneousStrands: DnaStrand[], originalStrands: DnaStrand[]): Observable<RecoveryResult> {
    return this.http.post<RecoveryResult>(`${this.apiBase}/recover`, {
      erroneousStrands,
      originalStrands,
    });
  }
}
