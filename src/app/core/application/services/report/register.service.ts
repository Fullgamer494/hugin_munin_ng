import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationRepository } from '../../../../infrastructure/adapters/repositories/report/register.repository';
import {
  CreateRegistroAltaUseCase,
  GetAllRegistrosAltaUseCase,
  GetRegistroAltaByIdUseCase,
  UpdateRegistroAltaUseCase,
  DeleteRegistroAltaUseCase,
  CreateEspecieUseCase,
  GetAllEspeciesUseCase,
  GetEspecieByIdUseCase
} from '../../../../features/animals/register-form.view/register.case';
import {
  RegistroAltaRequest,
  RegistroAltaResponse,
  EspecieRequest,
  EspecieResponse
} from '../../../../features/animals/register-form.view/register.model';

@Injectable({
  providedIn: 'root'
})
export class CreateRegistroAltaService extends CreateRegistroAltaUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(data: RegistroAltaRequest): Observable<{ id: number }> {  // ← Cambio aquí
    return this.repository.createRegistroAlta(data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAllRegistrosAltaService extends GetAllRegistrosAltaUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(): Observable<RegistroAltaResponse[]> {
    return this.repository.getAllRegistrosAlta();
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetRegistroAltaByIdService extends GetRegistroAltaByIdUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(id: number): Observable<RegistroAltaResponse> {
    return this.repository.getRegistroAltaById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateRegistroAltaService extends UpdateRegistroAltaUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(id: number, data: RegistroAltaRequest): Observable<{ message: string }> {
    return this.repository.updateRegistroAlta(id, data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeleteRegistroAltaService extends DeleteRegistroAltaUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(id: number): Observable<{ message: string }> {
    return this.repository.deleteRegistroAlta(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CreateEspecieService extends CreateEspecieUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(data: EspecieRequest): Observable<{ id: number }> {
    return this.repository.createEspecie(data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetAllEspeciesService extends GetAllEspeciesUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(): Observable<EspecieResponse[]> {
    return this.repository.getAllEspecies();
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetEspecieByIdService extends GetEspecieByIdUseCase {
  constructor(private repository: RegistrationRepository) {
    super();
  }

  execute(id: number): Observable<EspecieResponse> {
    return this.repository.getEspecieById(id);
  }
}