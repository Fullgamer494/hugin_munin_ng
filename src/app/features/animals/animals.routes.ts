import { Routes } from '@angular/router';

export const animalRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./animals-table.view/animals-table.view')
            .then(m => m.AnimalsTableView)
    },
    {
        path: 'register_animal',
        loadComponent: () => import('./register-form.view/register-form.view')
            .then(m => m.RegisterFormView)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./register-form-edit.view/register-form-edit.view')
            .then(m => m.RegisterFormEditView)
    },
    {
        path: 'more_info/:id',
        loadComponent: () => import('./animal-details.view/animal-details.view')
            .then(m => m.AnimalDetailsView)
    },
    {
        path: 'deregister/:id',  
        loadComponent: () => import('./deregister-form.view/deregister-form.view')
            .then(m => m.DeregisterFormView)
    }
];
