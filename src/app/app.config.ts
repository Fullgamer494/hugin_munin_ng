import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './api/interceptors/auth.interceptor';
import { AuthPort } from './api/domain/ports/auth.port';
import { AuthAdapter } from './api/infrastructure/adapters/auth.adapter';
import { EspecimenAltaPort } from './api/domain/ports/especimen-alta.port';
import { EspecimenAltaAdapter } from './api/infrastructure/adapters/especimen-alta.adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: AuthPort, useClass: AuthAdapter },
    { provide: EspecimenAltaPort, useClass: EspecimenAltaAdapter}
  ]
};