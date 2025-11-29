import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegistroBajaPort } from '../../domain/ports/especimen-baja.port';
import { CausaBajaResponse, RegistroBajaDetalleResponse, RegistroBajaRequest, RegistroBajaUpdateRequest } from '../../domain/models/especimen-baja.model';

import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EspecimenBajaAdapter implements RegistroBajaPort {
    private readonly BAJAS_URL = `${environment.apiUrl}/hm/registro-baja`;
    private readonly CAUSAS_URL = `${environment.apiUrl}/hm/causa-baja`;

    constructor(private http: HttpClient) { }

    getAllRegistros(): Observable<RegistroBajaDetalleResponse[]> {
        return this.http.get<RegistroBajaDetalleResponse[]>(this.BAJAS_URL).pipe(
            tap(data => console.log('API Response (All Bajas):', data))
        );
    }

    getRegistroByEspecimenId(especimenId: number): Observable<RegistroBajaDetalleResponse> {
        return this.http.get<RegistroBajaDetalleResponse>(`${this.BAJAS_URL}/especimen/${especimenId}`);
    }

    createRegistroBaja(request: RegistroBajaRequest): Observable<RegistroBajaDetalleResponse> {
        return this.http.post<RegistroBajaDetalleResponse>(this.BAJAS_URL, request);
    }

    updateRegistroBaja(id: number, request: RegistroBajaUpdateRequest): Observable<RegistroBajaDetalleResponse> {
        return this.http.put<RegistroBajaDetalleResponse>(`${this.BAJAS_URL}/${id}`, request);
    }

    deleteRegistroBaja(id: number): Observable<void> {
        return this.http.delete<void>(`${this.BAJAS_URL}/${id}`);
    }

    getAllCausasBaja(): Observable<CausaBajaResponse[]> {
        return this.http.get<CausaBajaResponse[]>(this.CAUSAS_URL);
    }
}
