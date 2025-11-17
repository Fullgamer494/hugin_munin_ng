import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/infrastructure/interceptors/auth.interceptor';

import { ReportRepository } from './core/domain/ports/outbound/report/report.repository';
import { SpecimenRepository } from './core/domain/ports/outbound/report/specimen.repository';
import {
  GetAllReportsUseCase,
  GetReportByIdUseCase,
  GetReportsBySpecimenUseCase,
  CreateReportUseCase,
  UpdateReportUseCase,
  DeleteReportUseCase
} from './core/domain/ports/inbound/report/report.use-case';
import {
  SearchSpecimensUseCase,
  GetSpecimenByIdUseCase
} from './core/domain/ports/inbound/report/specimen.use-case';

import { ReportRepositoryImpl } from './core/infrastructure/adapters/repositories/report/report.repository.impl';
import { SpecimenRepositoryImpl } from './core/infrastructure/adapters/repositories/report/specimen.repository.impl';
import {
  GetAllReportsService,
  GetReportByIdService,
  GetReportsBySpecimenService,
  CreateReportService,
  UpdateReportService,
  DeleteReportService
} from './core/application/services/report/report.service';
import {
  SearchSpecimensService,
  GetSpecimenByIdService
} from './core/application/services/report/specimen.service';

import { RegistrationRepository } from './core/infrastructure/adapters/repositories/report/register.repository';
import { RegistrationRepositoryImpl } from './core/infrastructure/adapters/repositories/report/register.repository.impl';
import {
  CreateRegistroAltaUseCase,
  GetAllRegistrosAltaUseCase,
  GetRegistroAltaByIdUseCase,
  UpdateRegistroAltaUseCase,
  DeleteRegistroAltaUseCase,
  CreateEspecieUseCase,
  GetAllEspeciesUseCase,
  GetEspecieByIdUseCase
} from './features/animals/register-form.view/register.case';
import {
  CreateRegistroAltaService,
  GetAllRegistrosAltaService,
  GetRegistroAltaByIdService,
  UpdateRegistroAltaService,
  DeleteRegistroAltaService,
  CreateEspecieService,
  GetAllEspeciesService,
  GetEspecieByIdService
} from './core/application/services/report/register.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    { provide: SpecimenRepository, useClass: SpecimenRepositoryImpl },
    
    { provide: GetAllReportsUseCase, useClass: GetAllReportsService },
    { provide: GetReportByIdUseCase, useClass: GetReportByIdService },
    { provide: GetReportsBySpecimenUseCase, useClass: GetReportsBySpecimenService },
    { provide: CreateReportUseCase, useClass: CreateReportService },
    { provide: UpdateReportUseCase, useClass: UpdateReportService },
    { provide: DeleteReportUseCase, useClass: DeleteReportService },
    
    { provide: SearchSpecimensUseCase, useClass: SearchSpecimensService },
    { provide: GetSpecimenByIdUseCase, useClass: GetSpecimenByIdService },

  
    { provide: RegistrationRepository, useClass: RegistrationRepositoryImpl },
    
    { provide: CreateRegistroAltaUseCase, useClass: CreateRegistroAltaService },
    { provide: GetAllRegistrosAltaUseCase, useClass: GetAllRegistrosAltaService },
    { provide: GetRegistroAltaByIdUseCase, useClass: GetRegistroAltaByIdService },
    { provide: UpdateRegistroAltaUseCase, useClass: UpdateRegistroAltaService },
    { provide: DeleteRegistroAltaUseCase, useClass: DeleteRegistroAltaService },
    
    { provide: CreateEspecieUseCase, useClass: CreateEspecieService },
    { provide: GetAllEspeciesUseCase, useClass: GetAllEspeciesService },
    { provide: GetEspecieByIdUseCase, useClass: GetEspecieByIdService }
  ]
};