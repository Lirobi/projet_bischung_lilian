import { Routes } from '@angular/router';
import { loggedInGuard } from '../../core/guards/logged-in';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes';

/** Routes sous /pollutions, chargées d'un bloc (loadChildren). Consultation libre, modification réservée aux connectés. */
export const POLLUTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pollution-list/pollution-list').then((m) => m.PollutionList),
    title: 'Pollutions',
  },
  {
    path: 'niveaux',
    loadComponent: () => import('./pollution-levels/pollution-levels').then((m) => m.PollutionLevels),
    title: 'Niveaux de pollution',
  },
  {
    path: 'nouvelle',
    loadComponent: () => import('./pollution-editor/pollution-editor').then((m) => m.PollutionEditor),
    title: 'Déclarer une pollution',
    canActivate: [loggedInGuard],
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id',
    loadComponent: () => import('./pollution-detail/pollution-detail').then((m) => m.PollutionDetail),
    title: 'Détail de la pollution',
  },
  {
    path: ':id/modifier',
    loadComponent: () => import('./pollution-editor/pollution-editor').then((m) => m.PollutionEditor),
    title: 'Modifier la pollution',
    canActivate: [loggedInGuard],
    canDeactivate: [unsavedChangesGuard],
  },
];
