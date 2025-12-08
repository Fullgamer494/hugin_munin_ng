import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthPort } from '../domain/ports/auth.port';
import { LoginRequest, TokenResponse } from '../domain/models/auth.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  
  constructor(private authPort: AuthPort) {}

  login(login: LoginRequest): Observable<TokenResponse> {
    return this.authPort.login(login);
  }

  logout(): void {
    this.authPort.logout();
  }

  isAuthenticated(): boolean {
    return this.authPort.isAuthenticated();
  }

  getCurrentUserId(): number | null {
    return this.authPort.getCurrentUserId();
  }
}