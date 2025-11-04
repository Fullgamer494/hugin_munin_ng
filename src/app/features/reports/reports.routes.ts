import { Routes } from '@angular/router';

export const reportRoutes: Routes = [
  {
    path: '',
    redirectTo: 'clinical',
    pathMatch: 'full'
  },
  {
    path: 'clinical',
    loadComponent: () => import('./report-form.view/report-form.view').then(m => m.ReportFormView),
    data: { reportType: 1 }
  },
  {
    path: 'behavioral',
    loadComponent: () => import('./report-form.view/report-form.view').then(m => m.ReportFormView),
    data: { reportType: 2 }
  },
  {
    path: 'dietary',
    loadComponent: () => import('./report-form.view/report-form.view').then(m => m.ReportFormView),
    data: { reportType: 3 }
  },
  {
    path: 'death',
    loadComponent: () => import('./report-form.view/report-form.view').then(m => m.ReportFormView),
    data: { reportType: 4 }
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./report-detail.view/report-detail.view').then(m => m.ReportDetailView)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./report-edit.view/report-edit.view').then(m => m.ReportEditView)
  },
  {
    path: 'history',
    loadComponent: () => import('./report-history.view/report-history.view').then(m => m.ReportHistoryView)
  }
];