import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, UserRole } from '../models';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Mock users — simulates an OIDC token response
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'admin@fintech.com': {
    password: 'admin123',
    user: {
      id: 'u001',
      name: 'Prabakar Karuppasamy',
      email: 'admin@fintech.com',
      role: 'admin',
      avatar: 'PK'
    }
  },
  'viewer@fintech.com': {
    password: 'viewer123',
    user: {
      id: 'u002',
      name: 'Sarah Johnson',
      email: 'viewer@fintech.com',
      role: 'viewer',
      avatar: 'SJ'
    }
  }
};

const TOKEN_KEY = 'fintech_auth_token';
const USER_KEY  = 'fintech_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _currentUser = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(private router: Router) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userJson = sessionStorage.getItem(USER_KEY);
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this._currentUser.set(user);
        this._isAuthenticated.set(true);
      } catch {
        this.clearSession();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    const entry = MOCK_USERS[credentials.email];
    if (!entry || entry.password !== credentials.password) {
      return throwError(() => new Error('Invalid email or password'));
    }
    // Simulate async OIDC token exchange
    return new Observable(observer => {
      setTimeout(() => {
        const token = `mock-jwt-${Date.now()}`;
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(entry.user));
        this._currentUser.set(entry.user);
        this._isAuthenticated.set(true);
        observer.next(entry.user);
        observer.complete();
      }, 800);
    });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  hasRole(role: UserRole): boolean {
    return this._currentUser()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  private clearSession(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
}
