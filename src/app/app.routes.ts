import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    data: {
      seo: {
        title: 'Personal Trainer in South Wimbledon | JR Fitness',
        description:
          'Personal training & online coaching based in South Wimbledon, London — also serving Colliers Wood. Real results without living in the gym.',
      },
    },
  },
  {
    path: 'apply',
    loadComponent: () => import('./pages/apply/apply.component').then(m => m.ApplyComponent),
    data: {
      seo: {
        title: 'Apply for Personal Training & Online Coaching | JR Fitness',
        description:
          "Apply for personal training or online coaching with JR Fitness — fill in a short form and I'll be in touch within 48 hours with your next steps.",
      },
    },
  },
  {
    path: '3-day-plan',
    loadComponent: () =>
      import('./pages/three-day-plan/three-day-plan.component').then(m => m.ThreeDayPlanComponent),
    data: {
      hideChrome: true,
      seo: {
        title: 'Your 3-Day Plan | JR Fitness',
        description: 'Download your free 3-day training plan from JR Fitness.',
      },
    },
  },
  {
    path: 'free-plan',
    loadComponent: () => import('./pages/free-plan/free-plan.component').then(m => m.FreePlanComponent),
    data: {
      seo: {
        title: 'Free 3-Day Full-Body Training Plan | JR Fitness',
        description:
          'Get a free 3-day, full-body training plan built on real coaching principles — 45–60 minutes, three times a week. No pressure, no commitment.',
      },
    },
  },
];
