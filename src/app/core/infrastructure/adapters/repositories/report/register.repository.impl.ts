import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import {
  RegistroAltaRequest,
  RegistroAltaResponse,
  EspecieRequest,
  EspecieResponse
} from '../../../../../features/animals/register-form.view/register.model';

export abstract class RegistrationRepository {
  abstract createEspecie(data: EspecieRequest): Observable<{ id: number }>;
  abstract getAllEspecies(): Observable<EspecieResponse[]>;
  abstract getEspecieById(id: number): Observable<EspecieResponse>;
  
  abstract createRegistroAlta(data: RegistroAltaRequest): Observable<{ id: number }>;
  abstract getAllRegistrosAlta(): Observable<RegistroAltaResponse[]>;
  abstract getRegistroAltaById(id: number): Observable<RegistroAltaResponse>;
  abstract updateRegistroAlta(id: number, data: RegistroAltaRequest): Observable<{ message: string }>;
  abstract deleteRegistroAlta(id: number): Observable<{ message: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationRepositoryImpl extends RegistrationRepository {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  createEspecie(data: EspecieRequest): Observable<{ id: number }> {
    const request = {
      genus: data.genus,
      species: data.species,
      commonName: data.commonName
    };
    
    console.log('📡 POST /api/species:', request);
    
    return this.http.post<{ id: number }>(
      `${this.apiUrl}/api/species`, 
      request
    );
  }

  getAllEspecies(): Observable<EspecieResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/species`).pipe(
      map(species => species.map(s => ({
        id: s.id,
        genus: s.genus,
        species: s.species,
        commonName: s.commonName
      })))
    );
  }

  getEspecieById(id: number): Observable<EspecieResponse> {
    return this.http.get<any>(`${this.apiUrl}/api/species/${id}`).pipe(
      map(s => ({
        id: s.id,
        genus: s.genus,
        species: s.species,
        commonName: s.commonName
      }))
    );
  }

  createRegistroAlta(data: RegistroAltaRequest): Observable<{ id: number }> {
    // ✅ SOLO enviamos los campos que existen en tu BD actual
    const request = {
      specimenId: data.specimenId,
      originId: data.originId,
      registeredBy: data.registeredBy,
      registrationDate: data.registrationDate,
      origin: data.origin || null,
      observations: data.observations || null
      // ❌ NO enviamos: originArea, destinationArea, originLocation, destinationLocation
    };

    console.log('📡 POST /api/registrations:', request);
    
    return this.http.post<{ id: number }>(
      `${this.apiUrl}/api/registrations`,
      request
    );
  }

  getAllRegistrosAlta(): Observable<RegistroAltaResponse[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/registrations`).pipe(
      map(registrations => registrations.map(r => this.mapRegistrationResponse(r)))
    );
  }

  getRegistroAltaById(id: number): Observable<RegistroAltaResponse> {
    return this.http.get<any>(`${this.apiUrl}/api/registrations/${id}`).pipe(
      map(r => this.mapRegistrationResponse(r))
    );
  }

  updateRegistroAlta(id: number, data: RegistroAltaRequest): Observable<{ message: string }> {
    const request = {
      specimenId: data.specimenId,
      originId: data.originId,
      registeredBy: data.registeredBy,
      registrationDate: data.registrationDate,
      origin: data.origin || null,
      observations: data.observations || null
    };

    return this.http.put<{ message: string }>(
      `${this.apiUrl}/api/registrations/${id}`,
      request
    );
  }

  deleteRegistroAlta(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/api/registrations/${id}`
    );
  }

  private mapRegistrationResponse(r: any): RegistroAltaResponse {
    return {
      id: r.id,
      specimenId: r.specimenId,
      inventoryNumber: r.inventoryNumber,
      specimenName: r.specimenName,
      genus: r.genus,
      species: r.species,
      commonName: r.commonName,
      sex: null,
      birthDate: null,
      originName: r.originName,
      registeredByName: r.registeredByName,
      registrationDate: r.registrationDate,
      origin: r.origin,
      observations: r.observations,
      createdAt: r.createdAt || r.registrationDate
    };
  }
}