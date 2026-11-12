import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { Auth } from '../services/auth';
import { guestGuard } from './guest';

describe('guestGuard', () => {
  const user: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };

  const run = () => TestBed.runInInjectionContext(() => guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => sessionStorage.clear());

  it('laisse passer un visiteur', () => {
    expect(run()).toBe(true);
  });

  it('renvoie un utilisateur connecté vers les pollutions', () => {
    TestBed.inject(Auth).login(user);
    expect(TestBed.inject(Router).serializeUrl(run() as ReturnType<Router['createUrlTree']>)).toBe('/pollutions');
  });
});
