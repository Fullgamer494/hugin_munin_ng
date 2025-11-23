import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';

export const routes: Routes = [
    // 1. RUTA PÚBLICA: Login
    {
        path: 'login',
        loadComponent: () => import('./layouts/public.layout/public.layout')
            .then(m => m.PublicLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./presentation/login/login-page/login-page')
                    .then(m => m.LoginPageComponent)
            }
        ]
    },

    // 2. RUTAS PRIVADAS: Todo lo demás
    // Protegidas por 'authGuard'. Si no hay token, redirige al login.
    {
        path: '',
        canActivate: [authGuard], 
        loadComponent: () => import('./layouts/private.layout/private.layout')
            .then(m => m.PrivateLayout),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.view/dashboard.view')
                    .then(m => m.DashboardView)
            },
            {
                path: 'animals',
                loadChildren: () => import('./features/animals/animals.routes')
                    .then(m => m.animalRoutes)
            },
            {
                path: 'removals',
                loadChildren: () => import('./features/removals/removals.routes')
                    .then(m => m.removalsRoutes)
            },
            {
                path: 'reports',
                loadChildren: () => import('./features/reports/reports.routes')
                    .then(m => m.reportRoutes)
            }
        ]
    },

    // 3. WILDCARD: Cualquier ruta desconocida redirige al dashboard (o login si no hay token)
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];