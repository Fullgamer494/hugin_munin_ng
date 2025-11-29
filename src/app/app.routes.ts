import { Routes } from '@angular/router';
import { authGuard } from './api/infrastructure/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/public.layout/public.layout')
            .then(m => m.PublicLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./presentation/landing/landing-page/landing-page')
                    .then(m => m.LandingPageComponent)
            },
            {
                path: 'login',
                loadComponent: () => import('./presentation/login/login-page/login-page')
                    .then(m => m.LoginPageComponent)
            }
        ]
    },

    {
        path: 'app',
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
            }
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];