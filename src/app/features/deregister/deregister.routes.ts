import { Routes } from '@angular/router';

export const deregisterRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../deregister/deregister')
            .then(m => m.Deregister)
    }
];
