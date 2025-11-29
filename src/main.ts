import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AuthAdapter } from './app/api/infrastructure/adapters/auth.adapter';
import { AuthInterceptor } from './app/api/interceptors/auth.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // ✅ AGREGA ESTO - Proveedor para el sistema de autenticación
    { provide: AuthPort, useClass: AuthAdapter },
    
    // Tus demás proveedores...
    { provide: ReportRepository, useClass: ReportRepositoryImpl },
    // ... resto de proveedores
  ]
};