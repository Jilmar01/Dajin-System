import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActionResponse } from '../../models/action-response';
import { Rol } from '../../models/rol';
import { LoginRequest, LoginResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  readonly userSession = signal<LoginResponse | null>(this.checkSession());

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post<ActionResponse<LoginResponse>>(`${environment.apiURL}/auth/login`, data)
      .pipe(
        map((res) => res.results),
        tap((session) => {
          localStorage.setItem('session', JSON.stringify(session));
          this.userSession.set(session);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('session');
    this.userSession.set(null);
  }

  getToken(): string | null {
    return this.userSession()?.token ?? null;
  }

  isRol(roles: Rol[]): boolean {
    const rol = this.userSession()?.rol;
    return !!rol && roles.includes(rol);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || this.isExpired(token)) {
      if (this.userSession()) {
        this.logout();
      }
      return false;
    }
    return true;
  }

  private checkSession(): LoginResponse | null {
    const user = localStorage.getItem('session');
    if (!user) {
      return null;
    }

    try {
      const session: LoginResponse = JSON.parse(user);
      if (!session?.token || this.isExpired(session.token)) {
        localStorage.removeItem('session');
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem('session');
      return null;
    }
  }

  private isExpired(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return true;
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}

