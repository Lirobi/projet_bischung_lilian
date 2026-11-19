import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';
import { Auth } from './auth';

describe('Auth', () => {
  const user: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };

  beforeEach(() => sessionStorage.clear());

  it("ne contient personne au départ", () => {
    const auth = TestBed.inject(Auth);
    expect(auth.user()).toBeNull();
    expect(auth.isLoggedIn()).toBe(false);
  });

  it("garde l'utilisateur connecté", () => {
    const auth = TestBed.inject(Auth);
    auth.login(user);
    expect(auth.user()).toEqual(user);
    expect(auth.isLoggedIn()).toBe(true);
  });

  it("le rend après un rechargement (sessionStorage)", () => {
    TestBed.inject(Auth).login(user);
    TestBed.resetTestingModule();
    expect(TestBed.inject(Auth).user()).toEqual(user);
  });

  it("l'oublie à la déconnexion", () => {
    const auth = TestBed.inject(Auth);
    auth.login(user);
    auth.logout();
    expect(auth.user()).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });
});
