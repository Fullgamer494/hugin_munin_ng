import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RegistrationRequest, RegistrationResponse } from '../models/registration.model';
import { DeregistrationRequest, DeregistrationResponse } from '../models/deregistration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  createRegistration(data: RegistrationRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/registrations`, data)
      .pipe(catchError(this.handleError));
  }

  getAllRegistrations(): Observable<RegistrationResponse[]> {
    return this.http.get<RegistrationResponse[]>(`${this.apiUrl}/registrations`)
      .pipe(catchError(this.handleError));
  }

  getRegistrationById(id: number): Observable<RegistrationResponse> {
    return this.http.get<RegistrationResponse>(`${this.apiUrl}/registrations/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateRegistration(id: number, data: RegistrationRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/registrations/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteRegistration(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/registrations/${id}`)
      .pipe(catchError(this.handleError));
  }

  createDeregistration(data: DeregistrationRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/deregistrations`, data)
      .pipe(catchError(this.handleError));
  }

  getAllDeregistrations(): Observable<DeregistrationResponse[]> {
    return this.http.get<DeregistrationResponse[]>(`${this.apiUrl}/deregistrations`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}