import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/infrastructure/interceptors/auth.interceptor';

// ✅ Importa lo que está en API
import { AuthPort } from './api/domain/ports/auth.port';
import { AuthAdapter } from './api/infrastructure/adapters/auth.adapter';

// ... resto de imports

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // ✅ AGREGA ESTE PROVEEDOR
    { provide: AuthPort, useClass: AuthAdapter },
    
  ]
};