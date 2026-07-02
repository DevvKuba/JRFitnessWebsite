import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'apply',
    loadComponent: () => import('./pages/apply/apply.component').then(m => m.ApplyComponent),
  },
  {
    path: '3-day-plan',
    loadComponent: () =>
      import('./pages/three-day-plan/three-day-plan.component').then(m => m.ThreeDayPlanComponent),
    data: { hideChrome: true },
  },
];
