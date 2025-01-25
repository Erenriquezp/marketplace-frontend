import { Routes } from '@angular/router';

export const INFO_ROUTES: Routes = [
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'how-it-works',
    loadComponent: () =>
      import('./how-it-works/how-it-works.component').then(m => m.HowItWorksComponent),
  },
  {
    path: 'faqs',
    loadComponent: () =>
      import('./faqs/faqs.component').then(m => m.FaqsComponent),
  },
  {
    path: 'conditions',
    loadComponent: () =>
      import('./conditions/conditions.component').then(m => m.ConditionsComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
  },
  {
    path: 'payment-policy',
    loadComponent: () =>
      import('./payment-policy/payment-policy.component').then(m => m.PaymentPolicyComponent),
  },
  {
    path: 'aid',
    loadComponent: () =>
      import('./aid/aid.component').then(m => m.AidComponent),
  },
];
