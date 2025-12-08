import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfoResponse } from '../domain/models/user.model';
import { AuthPort } from '../domain/ports/auth.port';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  constructor(private authPort: AuthPort) {}

  getCurrentUser(): Observable<UserInfoResponse> {
    return this.authPort.getCurrentUser();
  }
}