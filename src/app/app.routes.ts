import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';

export const routes: Routes = [
    // =======================================================
    // 1. ZONA PÚBLICA (Landing y Login) - Sin Guard
    // =======================================================
    {
        path: '',
        loadComponent: () => import('./layouts/public.layout/public.layout')
            .then(m => m.PublicLayout),
        children: [
            {
                path: '', // Al entrar a localhost:4200 -> Muestra LANDING
                loadComponent: () => import('./presentation/landing/landing-page/landing-page')
                    .then(m => m.LandingPageComponent)
            },
            {
                path: 'login', // Al entrar a localhost:4200/login -> Muestra LOGIN
                loadComponent: () => import('./presentation/login/login-page/login-page')
                    .then(m => m.LoginPageComponent)
            }
        ]
    },

    // =======================================================
    // 2. ZONA PRIVADA (Dashboard, Animales, etc.) - Con Guard
    // =======================================================
    {
        path: 'app', // Prefijo para todo lo privado
        canActivate: [authGuard], // ¡Aquí está la seguridad!
        loadComponent: () => import('./layouts/private.layout/private.layout')
            .then(m => m.PrivateLayout),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.view/dashboard.view')
                    .then(m => m.DashboardView)
            },
            // Tus otras rutas...
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
            },
            // Redirección interna: si entran a /app, van al dashboard
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },

    // 3. WILDCARD: Cualquier ruta desconocida -> Landing Page
    {
        path: '**',
        redirectTo: '' 
    }
];