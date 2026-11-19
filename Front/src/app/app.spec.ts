import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { Auth } from './core/services/auth';

describe('App routes', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes, withComponentInputBinding()),
      ],
    });
  });

  it('affiche la liste des pollutions sur /pollutions', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/pollutions');

    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Pollutions');
  });

  it("affiche le formulaire d'inscription sur /inscription", async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/inscription');

    expect(harness.routeNativeElement?.querySelector('app-sign-up')).not.toBeNull();
  });

  it("renvoie un visiteur de /utilisateurs vers l'inscription avec returnUrl", async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/utilisateurs');

    expect(TestBed.inject(Router).url).toBe('/inscription?returnUrl=%2Futilisateurs');
  });

  it('protège la création et la modification de pollution', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/pollutions/nouvelle');
    expect(TestBed.inject(Router).url).toBe('/inscription?returnUrl=%2Fpollutions%2Fnouvelle');

    await harness.navigateByUrl('/pollutions/3/modifier');
    expect(TestBed.inject(Router).url).toBe('/inscription?returnUrl=%2Fpollutions%2F3%2Fmodifier');
  });

  it("garde returnUrl dans le lien « Se connecter » de l'inscription", async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/utilisateurs');

    expect(harness.routeNativeElement?.querySelector('.alt a')?.getAttribute('href')).toBe(
      '/connexion?returnUrl=%2Futilisateurs',
    );
  });

  it('renvoie un utilisateur connecté de /connexion vers /pollutions', async () => {
    TestBed.inject(Auth).login({ id: 1, login: 'ada', lastName: 'L', firstName: 'A', email: 'a@b.fr' });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/connexion');

    expect(TestBed.inject(Router).url).toBe('/pollutions');
  });
});

describe('En-tête', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    });
  });

  it('propose la déconnexion quand on est connecté, et déconnecte', async () => {
    const auth = TestBed.inject(Auth);
    auth.login({ id: 1, login: 'ada', lastName: 'L', firstName: 'A', email: 'a@b.fr' });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('nav button')?.textContent).toContain('Déconnexion');
    expect(el.querySelector('a[href="/connexion"]')).toBeNull();

    el.querySelector<HTMLButtonElement>('nav button')!.click();
    await fixture.whenStable();

    expect(auth.isLoggedIn()).toBe(false);
    expect(el.querySelector('a[href="/connexion"]')).not.toBeNull();
  });
});
