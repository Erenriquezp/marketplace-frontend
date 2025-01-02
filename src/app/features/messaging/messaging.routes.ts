import { Routes } from '@angular/router';

export const MESSAGING_ROUTES: Routes = [
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat.component').then(m => m.ChatComponent),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications.component').then(
        m => m.NotificationsComponent
      ),
  },
];
