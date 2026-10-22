import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('App routes', () => {
  beforeEach(() => {
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
});
