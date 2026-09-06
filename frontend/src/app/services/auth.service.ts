import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '../models/auth.models';

const TOKEN_KEY = 'dna-sim-token';
const USER_KEY = 'dna-sim-user';

function readStoredUser(): AuthUser | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:3000/api/auth';

  readonly currentUser = signal<AuthUser | null>(readStoredUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBase}/register`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBase}/login`, payload)
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
