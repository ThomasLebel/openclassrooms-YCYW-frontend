import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'chat', loadComponent: () => import('./pages/chat/chat').then((m) => m.Chat) },
  {
    path: 'chat-history',
    loadComponent: () => import('./pages/chat-history/chat-history').then((m) => m.ChatHistory),
  },
];
