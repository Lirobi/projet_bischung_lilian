import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { Auth } from '../services/auth';
import { loggedInGuard } from './logged-in';

describe('loggedInGuard', () => {
  const user: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };

  const run = (url = '/utilisateurs') =>
    TestBed.runInInjectionContext(() => loggedInGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot));

  beforeEach(() => sessionStorage.clear());

  it("redirige un visiteur vers l'inscription en gardant l'URL demandée", () => {
    const result = run('/pollutions/nouvelle');
    expect(TestBed.inject(Router).serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe(
      '/inscription?returnUrl=%2Fpollutions%2Fnouvelle',
    );
  });

  it('laisse passer un utilisateur connecté', () => {
    TestBed.inject(Auth).login(user);
    expect(run()).toBe(true);
  });
});
