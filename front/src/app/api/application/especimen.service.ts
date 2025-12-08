import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EspecimenAltaPort } from '../domain/ports/especimen-alta.port';
import { AltaEspecimenRequest, EspecimenDetalleResponse, UpdateAltaEspecimenRequest } from '../domain/models/especimen-alta.model';
import { RegistroBajaPort } from '../domain/ports/especimen-baja.port';
import { CausaBajaResponse, RegistroBajaDetalleResponse, RegistroBajaRequest, RegistroBajaUpdateRequest } from '../domain/models/especimen-baja.model';

@Injectable({ providedIn: 'root' })
export class EspecimenService {

  constructor(
    private especimenAltaPort: EspecimenAltaPort,
    private registroBajaPort: RegistroBajaPort
  ) { }

  // Registro Alta
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

  // Registro Baja
  getAllRegistrosBaja(): Observable<RegistroBajaDetalleResponse[]> {
    return this.registroBajaPort.getAllRegistros();
  }

  getRegistroBajaByEspecimenId(especimenId: number): Observable<RegistroBajaDetalleResponse> {
    return this.registroBajaPort.getRegistroByEspecimenId(especimenId);
  }

  createRegistroBaja(request: RegistroBajaRequest): Observable<RegistroBajaDetalleResponse> {
    return this.registroBajaPort.createRegistroBaja(request);
  }

  updateRegistroBaja(id: number, request: RegistroBajaUpdateRequest): Observable<RegistroBajaDetalleResponse> {
    return this.registroBajaPort.updateRegistroBaja(id, request);
  }

  deleteRegistroBaja(id: number): Observable<void> {
    return this.registroBajaPort.deleteRegistroBaja(id);
  }

  getAllCausasBaja(): Observable<CausaBajaResponse[]> {
    return this.registroBajaPort.getAllCausasBaja();
  }

}