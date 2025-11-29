// Lógica de orquestación pura. El componente solo conoce este servicio.

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthPort } from '../domain/ports/auth.port';
import { LoginRequest, TokenResponse } from '../domain/models/auth.model';

@Injectable({ providedIn: 'root' })
// Renombramos a LoginService para que el componente sepa su función.
export class LoginService {
  
  // Depende únicamente del PUERTO (AuthPort)
  constructor(private authPort: AuthPort) {}

  login(login: LoginRequest): Observable<TokenResponse> {
    return this.authPort.login(login);
  }

  logout(): void {
    this.authPort.logout();
  }
}