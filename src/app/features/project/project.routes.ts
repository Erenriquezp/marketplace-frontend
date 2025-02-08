import { Routes } from '@angular/router';

export const PROJECT_ROUTES: Routes = [
  {
    path: 'detail/:id', 
    loadComponent: () => import('./detail/detail.component').then(m => m.DetailComponent),
  },
  {
    path: 'post',
    loadComponent: () => import('./post/post.component').then(m => m.PostComponent),
  },
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(m => m.ProjectListComponent),
  },
  {
    path: 'applications/:projectId',
    loadComponent: () => import('./proposal/proposal.component').then(m => m.ProposalComponent),
  }
];
