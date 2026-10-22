import { Routes } from '@angular/router';
import { PollutionDetail } from './features/pollutions/pollution-detail/pollution-detail';
import { PollutionEditor } from './features/pollutions/pollution-editor/pollution-editor';
import { PollutionList } from './features/pollutions/pollution-list/pollution-list';
import { SignUpPage } from './features/sign-up/sign-up-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pollutions' },
  { path: 'pollutions', component: PollutionList, title: 'Pollutions' },
  { path: 'pollutions/nouvelle', component: PollutionEditor, title: 'Déclarer une pollution' },
  { path: 'pollutions/:id', component: PollutionDetail, title: 'Détail de la pollution' },
  { path: 'pollutions/:id/modifier', component: PollutionEditor, title: 'Modifier la pollution' },
  { path: 'inscription', component: SignUpPage, title: 'Inscription' },
  { path: '**', redirectTo: 'pollutions' },
];
