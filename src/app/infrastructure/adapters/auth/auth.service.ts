import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from '../storage/cookie.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.cookieService.set('auth_token', response.token, 1);
        this.cookieService.set('user_role', response.role, 1);
        
        // Extraer el ID del token para que 'getCurrentUserId' funcione
        const userId = this.getUserIdFromToken(response.token);
        if (userId) {
          this.cookieService.set('user_id', userId.toString(), 1);
        }
      })
    );
  }

  logout(): void {
    this.cookieService.delete('auth_token');
    this.cookieService.delete('user_role');
    this.cookieService.delete('user_id');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.cookieService.exists('auth_token');
  }

  getToken(): string | null {
    return this.cookieService.get('auth_token');
  }

  getUserRole(): string | null {
    return this.cookieService.get('user_role');
  }

  getCurrentUserId(): number | null {
    const id = this.cookieService.get('user_id');
    return id ? parseInt(id, 10) : null;
  }

  // Función auxiliar para leer el ID oculto en el Token JWT
private getUserIdFromToken(token: string): number | null {
    try {
      if (!token || token.split('.').length < 2) return null; // Validación extra
      
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id || null;
    } catch (e) {
      console.warn('Error al decodificar el token:', e);
      return null;
    }
  }
}