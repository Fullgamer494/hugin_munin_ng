
import { Observable } from 'rxjs';
import { RegistroAltaRequest, RegistroAltaResponse, EspecieRequest, EspecieResponse } from '../../../../features/animals/register-form.view/register.model';

export abstract class RegistrationRepository {
  abstract createRegistroAlta(data: RegistroAltaRequest): Observable<RegistroAltaResponse>;
  abstract getAllRegistrosAlta(): Observable<RegistroAltaResponse[]>;
  abstract getRegistroAltaById(id: number): Observable<RegistroAltaResponse>;
  abstract updateRegistroAlta(id: number, data: RegistroAltaRequest): Observable<{ message: string }>;
  abstract deleteRegistroAlta(id: number): Observable<{ message: string }>;
  
  abstract createEspecie(data: EspecieRequest): Observable<{ id: number }>;
  abstract getAllEspecies(): Observable<EspecieResponse[]>;
  abstract getEspecieById(id: number): Observable<EspecieResponse>;
}