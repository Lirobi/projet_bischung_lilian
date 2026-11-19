import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest';
import { loggedInGuard } from './core/guards/logged-in';

// Chaque page est chargée à la demande (lazy loading) : son code n'est téléchargé qu'à la première visite.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pollutions' },
  { path: 'pollutions', loadChildren: () => import('./features/pollutions/pollutions.routes').then((m) => m.POLLUTION_ROUTES) },
  {
    path: 'inscription',
    loadComponent: () => import('./features/sign-up/sign-up-page').then((m) => m.SignUpPage),
    title: 'Inscription',
    canActivate: [guestGuard],
  },
  {
    path: 'connexion',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    title: 'Connexion',
    canActivate: [guestGuard],
  },
  {
    path: 'utilisateurs',
    loadComponent: () => import('./features/users/user-list/user-list').then((m) => m.UserList),
    title: 'Utilisateurs',
    canActivate: [loggedInGuard],
  },
  { path: '**', redirectTo: 'pollutions' },
];
