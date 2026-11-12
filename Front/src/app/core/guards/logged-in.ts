import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Laisse passer un utilisateur connecté, renvoie les autres vers la connexion en gardant l'URL demandée. */
export const loggedInGuard: CanActivateFn = (_route, state) => {
  return inject(Auth).isLoggedIn()
    ? true
    : inject(Router).createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
};
