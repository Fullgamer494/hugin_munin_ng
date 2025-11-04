import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/reports/clinical',
    pathMatch: 'full'
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.reportRoutes)
  }
];