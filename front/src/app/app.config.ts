import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './api/interceptors/auth.interceptor';
import { AuthPort } from './api/domain/ports/auth.port';
import { AuthAdapter } from './api/infrastructure/adapters/auth.adapter';
import { EspecimenAltaPort } from './api/domain/ports/especimen-alta.port';
import { EspecimenAltaAdapter } from './api/infrastructure/adapters/especimen-alta.adapter';
import { ReportPort } from './api/domain/ports/report.port';
import { ReportAdapter } from './api/infrastructure/adapters/report.adapter';
import { EspecimenService } from './api/application/especimen.service';
import { RegistroBajaPort } from './api/domain/ports/especimen-baja.port';
import { EspecimenBajaAdapter } from './api/infrastructure/adapters/especimen-baja.adapter';
import { StatisticsPort } from './api/domain/ports/statistics.port';
import { StatisticsAdapter } from './api/infrastructure/adapters/statistics.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptors([authInterceptor])),

    { provide: AuthPort, useClass: AuthAdapter },
    { provide: EspecimenAltaPort, useClass: EspecimenAltaAdapter },
    { provide: ReportPort, useClass: ReportAdapter },
    { provide: RegistroBajaPort, useClass: EspecimenBajaAdapter },
    { provide: StatisticsPort, useClass: StatisticsAdapter },
    { provide: EspecimenService, useClass: EspecimenService },
  ]
};