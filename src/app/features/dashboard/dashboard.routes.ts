import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'client',
    loadComponent: () =>
      import('./client/client.component').then((m) => m.ClientComponent),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_USER'] }, // Solo para clientes
  },
  {
    path: 'freelancer',
    loadComponent: () =>
      import('./freelancer/freelancer.component').then((m) => m.FreelancerComponent),
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_FREELANCER'] }, // Solo para freelancers
  },
];
