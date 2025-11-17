import { Routes } from '@angular/router';
import { authGuard } from './core/infrastructure/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./layouts/private.layout/private.layout')
            .then(m => m.PrivateLayout),
        children: [
            {
                path: '',
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
    }
];
