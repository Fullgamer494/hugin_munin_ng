import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EspecimenAltaPort } from '../../domain/ports/especimen-alta.port';
import { AltaEspecimenRequest, EspecimenDetalleResponse, UpdateAltaEspecimenRequest } from '../../domain/models/especimen-alta.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EspecimenAltaAdapter implements EspecimenAltaPort {
    
    private readonly API_URL = `${environment.apiUrl}/hm/especimen`; 

    constructor(private http: HttpClient) {}

    getAllSpecimens(): Observable<EspecimenDetalleResponse[]> {
        return this.http.get<EspecimenDetalleResponse[]>(this.API_URL);
    }
    
    getSpecimenById(id: number): Observable<EspecimenDetalleResponse> {
        return this.http.get<EspecimenDetalleResponse>(`${this.API_URL}/${id}`);
    }

    saveSpecimen(altaRequest: AltaEspecimenRequest): Observable<any>{
        const dtoKtor: any = { ...altaRequest };

        if(altaRequest.fechaIngreso instanceof Date){
            dtoKtor.fechaIngreso = altaRequest.fechaIngreso.toISOString().split('T')[0];
        }

        return this.http.post<any>(`${this.API_URL}/alta`, dtoKtor);
    }

    updateSpecimen(id: number, updateAltaRequest: UpdateAltaEspecimenRequest): Observable<any> {
        const dtoKtor: any = { ...updateAltaRequest };

        if(updateAltaRequest.fechaIngreso instanceof Date){
            dtoKtor.fechaIngreso = updateAltaRequest.fechaIngreso.toISOString().split('T')[0];
        }

        return this.http.put<any>(`${this.API_URL}/${id}`, dtoKtor);
    }
}