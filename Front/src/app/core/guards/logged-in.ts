import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

/** Laisse passer un utilisateur connecté, renvoie les autres vers l'inscription. */
export const loggedInGuard: CanActivateFn = () => {
  return inject(Auth).isLoggedIn() ? true : inject(Router).createUrlTree(['/inscription']);
};
