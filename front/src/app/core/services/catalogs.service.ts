import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RegistrationOrigin, DeregistrationCause } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getRegistrationOrigins(): Observable<RegistrationOrigin[]> {
    return this.http.get<RegistrationOrigin[]>(`${this.apiUrl}/registration-origins`)
      .pipe(catchError(this.handleError));
  }

  getDeregistrationCauses(): Observable<DeregistrationCause[]> {
    return this.http.get<DeregistrationCause[]>(`${this.apiUrl}/deregistration-causes`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}