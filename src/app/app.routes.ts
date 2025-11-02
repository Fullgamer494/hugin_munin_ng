import { Routes } from '@angular/router';
import { Form } from './register/form/form';
import { Principal } from './deregister/principal/principal';

export const routes: Routes = [
  { path: '', redirectTo: 'registrar', pathMatch: 'full' },
  { path: 'registrar', component: Form },
  { path: 'dar-de-baja', component: Principal },
];