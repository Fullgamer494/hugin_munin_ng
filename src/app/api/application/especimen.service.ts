import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EspecimenAltaPort } from '../domain/ports/especimen-alta.port';
import { AltaEspecimenRequest, EspecimenDetalleResponse, UpdateAltaEspecimenRequest } from '../domain/models/especimen-alta.model';

@Injectable({ providedIn: 'root' })
export class EspecimenService {
  
  constructor(private especimenAltaPort: EspecimenAltaPort) {}
  
  getAllSpecimens(): Observable<EspecimenDetalleResponse[]> {
    return this.especimenAltaPort.getAllSpecimens();
  }

  getSpecimenById(id: number): Observable<EspecimenDetalleResponse> {
    return this.especimenAltaPort.getSpecimenById(id);
  }

  saveSpecimen(altaRequest: AltaEspecimenRequest): Observable<any> {
    return this.especimenAltaPort.saveSpecimen(altaRequest);
  }

  updateSpecimen(id: number, updateAltaRequest: UpdateAltaEspecimenRequest): Observable<any> {
    return this.especimenAltaPort.updateSpecimen(id, updateAltaRequest);
  }

}