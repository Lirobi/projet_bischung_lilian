import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Réservé aux visiteurs : un utilisateur déjà connecté est renvoyé vers la liste des pollutions. */
export const guestGuard: CanActivateFn = () => {
  return inject(Auth).isLoggedIn() ? inject(Router).createUrlTree(['/pollutions']) : true;
};
