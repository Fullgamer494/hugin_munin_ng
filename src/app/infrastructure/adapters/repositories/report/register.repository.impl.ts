// src/app/infrastructure/adapters/repositories/registration/registration.repository.impl.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { RegistrationRepository } from '../../../../infrastructure/adapters/repositories/report/register.repository';
import { 
  RegistroAltaRequest, 
  RegistroAltaResponse, 
  EspecieRequest, 
  EspecieResponse 
} from '../../../../features/animals/register-form.view/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationRepositoryImpl extends RegistrationRepository {
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
    super();
  }

  createRegistroAlta(data: RegistroAltaRequest): Observable<RegistroAltaResponse> {
    return this.http.post<RegistroAltaResponse>(`${this.apiUrl}/api/registro-alta`, data);
  }

  getAllRegistrosAlta(): Observable<RegistroAltaResponse[]> {
    return this.http.get<RegistroAltaResponse[]>(`${this.apiUrl}/api/registro-alta`);
  }

  getRegistroAltaById(id: number): Observable<RegistroAltaResponse> {
    return this.http.get<RegistroAltaResponse>(`${this.apiUrl}/api/registro-alta/${id}`);
  }

  updateRegistroAlta(id: number, data: RegistroAltaRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/api/registro-alta/${id}`, data);
  }

  deleteRegistroAlta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/api/registro-alta/${id}`);
  }

  
  createEspecie(data: EspecieRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/api/especies`, data);
  }

  getAllEspecies(): Observable<EspecieResponse[]> {
    return this.http.get<EspecieResponse[]>(`${this.apiUrl}/api/especies`);
  }

  getEspecieById(id: number): Observable<EspecieResponse> {
    return this.http.get<EspecieResponse>(`${this.apiUrl}/api/especies/${id}`);
  }
}