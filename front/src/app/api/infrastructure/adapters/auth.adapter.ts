import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthPort } from '../../domain/ports/auth.port';
import { LoginRequest, TokenResponse } from '../../domain/models/auth.model';
import { TokenService } from '../services/token.service';
import { environment } from '../../../../environments/environment';
import { UserInfoResponse } from '../../domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthAdapter implements AuthPort {
  private readonly API_URL = `${environment.apiUrl}/auth/login`;
  private readonly USER_INFO_URL = `${environment.apiUrl}/auth/me`

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

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

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }
  
  getCurrentUserId(): number | null {
    const token = this.tokenService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }

  getCurrentUser(): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(this.USER_INFO_URL);
  }
}