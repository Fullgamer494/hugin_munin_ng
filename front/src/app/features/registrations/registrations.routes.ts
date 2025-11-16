import { Routes } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { DeregisterFormComponent } from './components/deregister-form/deregister-form.component';
import { RegistrationsListComponent } from './components/registrations-list/registrations-list.component';

export const REGISTRATION_ROUTES: Routes = [
  {
    path: '',
    component: RegistrationsListComponent
  },
  {
    path: 'register',
    component: RegisterFormComponent
  },
  {
    path: 'deregister',
    component: DeregisterFormComponent
  }
];