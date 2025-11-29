import { Injectable } from '@angular/core';

const TOKEN_KEY = 'jwt_token';
const EXPIRATION_DAYS = 7; 

@Injectable({ providedIn: 'root' })
export class TokenService {

  constructor() { }

  /**
   * Calcula la fecha de expiración para la cookie.
   */
  private getExpirationDate(): string {
    const date = new Date();
    date.setTime(date.getTime() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000));
    return date.toUTCString();
  }

  /**
   * Guarda el token en la cookie del navegador usando document.cookie.
   */
  saveToken(token: string): void {
    const expires = this.getExpirationDate();
    // Método NATIVO para guardar: Se concatena el string de la cookie.
    // Incluimos Path, Expiration, y SameSite/Secure (si es HTTPS)
    document.cookie = `${TOKEN_KEY}=${token}; expires=${expires}; path=/; SameSite=Lax`;
  }

  /**
   * Obtiene el token de la cookie parseando el string de document.cookie.
   */
  getToken(): string | null {
    // Método NATIVO para leer: Se busca la clave dentro del string completo.
    const nameEQ = TOKEN_KEY + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
  }

  /**
   * Elimina el token de la cookie estableciendo una fecha de expiración en el pasado.
   */
  removeToken(): void {
    // Método NATIVO para eliminar: Se sobrescribe con una fecha expirada.
    document.cookie = `${TOKEN_KEY}=; Max-Age=0; path=/`; 
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}