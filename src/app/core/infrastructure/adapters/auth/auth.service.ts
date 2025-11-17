import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from '../storage/cookie.service';
import { environment } from '../../../../../environments/environment';

interface AuthResponse {
  token: string;
  userId: number;
  userName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.cookieService.set('auth_token', response.token, 7);
        this.cookieService.set('user_id', response.userId.toString(), 7);
        this.cookieService.set('user_name', response.userName, 7);
        this.cookieService.set('user_role', response.role, 7);
      })
    );
  }

  logout(): void {
    this.cookieService.delete('auth_token');
    this.cookieService.delete('user_id');
    this.cookieService.delete('user_name');
    this.cookieService.delete('user_role');
  }

  isAuthenticated(): boolean {
    return this.cookieService.exists('auth_token');
  }

  getToken(): string | null {
    return this.cookieService.get('auth_token');
  }

  getCurrentUserId(): number | null {
    const userId = this.cookieService.get('user_id');
    return userId ? parseInt(userId) : null;
  }

  getCurrentUserName(): string | null {
    return this.cookieService.get('user_name');
  }

  getUserRole(): string | null {
    return this.cookieService.get('user_role');
  }
}