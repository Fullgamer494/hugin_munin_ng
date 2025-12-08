import { Observable } from "rxjs";
import { EspecimenDetalleResponse, AltaEspecimenRequest, UpdateAltaEspecimenRequest } from "../models/especimen-alta.model";

export abstract class EspecimenAltaPort {
    abstract getAllSpecimens(): Observable<EspecimenDetalleResponse[]>;
    abstract getSpecimenById(id: number): Observable<EspecimenDetalleResponse>;

    abstract saveSpecimen(altaRequest: AltaEspecimenRequest): Observable<any>;
    abstract updateSpecimen(id:number, updateAltaRequest: UpdateAltaEspecimenRequest): Observable<any>;
}