// Implementación del Puerto usando HttpClient.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthPort } from '../../domain/ports/auth.port';
import { LoginRequest, TokenResponse } from '../../domain/models/auth.model';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthAdapter implements AuthPort {
  private readonly API_URL = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(login: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.API_URL, login).pipe(
      tap(response => {
        this.tokenService.saveToken(response.accessToken);
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
  }
}