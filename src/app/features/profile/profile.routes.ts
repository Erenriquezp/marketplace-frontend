import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'public/:id',
    loadComponent: () =>
      import('./public/public.component').then(m => m.PublicComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then(m => m.SettingsComponent),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./transactions/transactions.component').then(
        m => m.TransactionsComponent
      ),
  },
];
