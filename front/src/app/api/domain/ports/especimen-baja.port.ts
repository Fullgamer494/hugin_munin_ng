import { Observable } from 'rxjs';
import { RegistroBajaDetalleResponse, RegistroBajaRequest, RegistroBajaUpdateRequest, CausaBajaResponse } from '../models/especimen-baja.model';

export abstract class RegistroBajaPort {
    abstract getAllRegistros(): Observable<RegistroBajaDetalleResponse[]>;
    abstract getRegistroByEspecimenId(especimenId: number): Observable<RegistroBajaDetalleResponse>;

    abstract createRegistroBaja(request: RegistroBajaRequest): Observable<RegistroBajaDetalleResponse>;

    abstract updateRegistroBaja(id: number, request: RegistroBajaUpdateRequest): Observable<RegistroBajaDetalleResponse>;

    abstract deleteRegistroBaja(id: number): Observable<void>;

    abstract getAllCausasBaja(): Observable<CausaBajaResponse[]>;
}