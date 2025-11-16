import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SpeciesRequest, SpeciesResponse, SpecimenRequest, SpecimenResponse } from '../models/specimen.model';

@Injectable({
  providedIn: 'root'
})
export class SpecimenService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  createSpecies(data: SpeciesRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/species`, data)
      .pipe(catchError(this.handleError));
  }

  getAllSpecies(): Observable<SpeciesResponse[]> {
    return this.http.get<SpeciesResponse[]>(`${this.apiUrl}/species`)
      .pipe(catchError(this.handleError));
  }

  getSpeciesById(id: number): Observable<SpeciesResponse> {
    return this.http.get<SpeciesResponse>(`${this.apiUrl}/species/${id}`)
      .pipe(catchError(this.handleError));
  }

  createSpecimen(data: SpecimenRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/specimens`, data)
      .pipe(catchError(this.handleError));
  }

  getAllSpecimens(): Observable<SpecimenResponse[]> {
    return this.http.get<SpecimenResponse[]>(`${this.apiUrl}/specimens`)
      .pipe(catchError(this.handleError));
  }

  getSpecimenById(id: number): Observable<SpecimenResponse> {
    return this.http.get<SpecimenResponse>(`${this.apiUrl}/specimens/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateSpecimen(id: number, data: SpecimenRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/specimens/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  deleteSpecimen(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/specimens/${id}`)
      .pipe(catchError(this.handleError));
  }

  searchByName(name: string): Observable<SpecimenResponse[]> {
    return this.http.get<SpecimenResponse[]>(`${this.apiUrl}/specimens/search?name=${name}`)
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