import { Routes } from '@angular/router';
import { Form } from './register/form/form';
import { Principal } from './deregister/principal/principal';

export const routes: Routes = [
<<<<<<< Updated upstream
  { path: '', redirectTo: 'registrar', pathMatch: 'full' },
  { path: 'registrar', component: Form },
  { path: 'dar-de-baja', component: Principal },
];
=======
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
                path: 'register',
                loadChildren: () => import('./features/register/register.routes')
                    .then(m => m.registerRoutes)
            },
            {
                path: 'deregister',
                loadChildren: () => import('./features/deregister/deregister.routes')
                    .then(m => m.deregisterRoutes)
            }


        ]
    }
];
>>>>>>> Stashed changes
