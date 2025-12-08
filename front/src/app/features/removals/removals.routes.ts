import { Routes } from '@angular/router';

export const removalsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./removals-table.view/removals-table.view')
            .then(m => m.RemovalsTableView)
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./animal-details.view/animal-details.view')
            .then(m => m.AnimalDetailsView)
    }
];
