import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DnaStrand } from '../models/simulation.models';

interface EncodeResponse {
  text: string;
  strands: DnaStrand[];
}

@Service()
export class DnaEncoder {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.backendUrl + '/api/simulation';

  encode(text: string): Observable<EncodeResponse> {
    return this.http.post<EncodeResponse>(`${this.apiBase}/encode`, { text });
  }
}
