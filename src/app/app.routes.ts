import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () =>
      import('./presentation/landing/landing-page/landing-page')
        .then(c => c.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./presentation/login/login-page/login-page')
        .then(c => c.LoginPageComponent)
  },
  {
    path: '', // Redirige la raíz a 'landing'
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: '**', // Redirige cualquier otra cosa a 'landing'
    redirectTo: 'landing'
  }
];