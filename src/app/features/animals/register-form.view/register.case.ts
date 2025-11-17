import { Observable } from 'rxjs';
import { RegistroAltaRequest, RegistroAltaResponse, EspecieRequest, EspecieResponse } from '../../../features/animals/register-form.view/register.model';

export abstract class CreateRegistroAltaUseCase {
  abstract execute(data: RegistroAltaRequest): Observable<{ id: number }>;  // ← Cambio aquí
}

export abstract class GetAllRegistrosAltaUseCase {
  abstract execute(): Observable<RegistroAltaResponse[]>;
}

export abstract class GetRegistroAltaByIdUseCase {
  abstract execute(id: number): Observable<RegistroAltaResponse>;
}

export abstract class UpdateRegistroAltaUseCase {
  abstract execute(id: number, data: RegistroAltaRequest): Observable<{ message: string }>;
}

export abstract class DeleteRegistroAltaUseCase {
  abstract execute(id: number): Observable<{ message: string }>;
}

export abstract class CreateEspecieUseCase {
  abstract execute(data: EspecieRequest): Observable<{ id: number }>;
}

export abstract class GetAllEspeciesUseCase {
  abstract execute(): Observable<EspecieResponse[]>;
}

export abstract class GetEspecieByIdUseCase {
  abstract execute(id: number): Observable<EspecieResponse>;
}