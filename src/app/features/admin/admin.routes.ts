import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'user-management',
    loadComponent: () =>
      import('./user-management/user-management.component').then(
        m => m.UserManagementComponent
      ),
  },
  {
    path: 'product-approval',
    loadComponent: () =>
      import('./product-approval/product-approval.component').then(
        m => m.ProductApprovalComponent
      ),
  },
];
