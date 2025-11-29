import { Routes } from '@angular/router';
import { authGuard } from './core/infrastructure/guards/auth.guard';

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
                path: '', // localhost:4200 -> Landing
                loadComponent: () => import('./presentation/landing/landing-page/landing-page')
                    .then(m => m.LandingPageComponent)
            },
            {
                path: 'login', // localhost:4200/login -> Login
                loadComponent: () => import('./presentation/login/login-page/login-page')
                    .then(m => m.LoginPageComponent)
            }
        ]
    },

    // =======================================================
    // 2. ZONA PRIVADA (Dashboard, Animales, etc.) - Con Guard
    // =======================================================
    {
        path: 'app', // Prefijo para rutas protegidas
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

    // =======================================================
    // 3. WILDCARD: Rutas desconocidas -> Landing
    // =======================================================
    {
        path: '**',
        redirectTo: ''
    }
];