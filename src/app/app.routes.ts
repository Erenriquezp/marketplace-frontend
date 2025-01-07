import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { DASHBOARD_ROUTES } from '../app/features/dashboard/dashboard.routes';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // Layout principal
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'marketplace',
        loadChildren: () =>
          import('./features/marketplace/marketplace.routes').then(
            m => m.MARKETPLACE_ROUTES
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then(
            m => m.PROFILE_ROUTES
          ),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent, // Layout para autenticación
    children: AUTH_ROUTES,
  },
  {
    path: 'dashboard',
    children: DASHBOARD_ROUTES, // Carga las rutas del dashboard
  },
];
