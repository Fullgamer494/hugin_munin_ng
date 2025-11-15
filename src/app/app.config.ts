import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './infrastructure/interceptors/auth.interceptor';

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

import { ReportRepositoryImpl } from './infrastructure/adapters/repositories/report/report.repository.impl';
import { SpecimenRepositoryImpl } from './infrastructure/adapters/repositories/report/specimen.repository.impl';
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
    { provide: GetSpecimenByIdUseCase, useClass: GetSpecimenByIdService }

    
  ]
};

