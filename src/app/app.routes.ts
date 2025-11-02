import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/guards/auth.guard';

//Se agregarán las demás rutas cuando existan

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/reports/clinical',
    pathMatch: 'full'
  },
  /*
  {
    path: 'login',
    loadComponent: () => import('./presentation/pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  */
  {
  path: 'detail/:id',
  loadComponent: () => import('./presentation/pages/reports/report-detail/report-detail.component').then(m => m.ReportDetailComponent)
  },
  {
  path: 'reports/history',
  loadComponent: () => import('./presentation/pages/reports/report-history/report-history.component').then(m => m.ReportHistoryComponent)
  },
  {
  path: 'reports/edit/:id',
  loadComponent: () => import('./presentation/pages/reports/report-edit/report-edit.component').then(m => m.ReportEditComponent)
  },
  {
    path: 'reports',
    children: [
      {
          path: 'clinical',
      loadComponent: () => import('./presentation/pages/reports/report-form/report-form.component').then(m => m.ReportFormComponent),
      data: { reportType: 1 }
      },
      {
        path: 'behavioral',
        loadComponent: () => import('./presentation/pages/reports/report-form/report-form.component').then(m => m.ReportFormComponent),
        data: { reportType: 2 }
      },
      {
        path: 'dietary',
        loadComponent: () => import('./presentation/pages/reports/report-form/report-form.component').then(m => m.ReportFormComponent),
        data: { reportType: 3 }
      },
      {
        path: 'death',
        loadComponent: () => import('./presentation/pages/reports/report-form/report-form.component').then(m => m.ReportFormComponent),
        data: { reportType: 4 }
      }
    ]
  }
];