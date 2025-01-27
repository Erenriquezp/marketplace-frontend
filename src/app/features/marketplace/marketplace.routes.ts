import { Routes } from '@angular/router';

export const MARKETPLACE_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then(m => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./freelance-service/freelance-service.component').then(m => m.FreelanceServicesComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./search/search.component').then(m => m.SearchComponent),
  },
];
