import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Pollution } from '../../../core/models/pollution.model';
import { PollutionList } from './pollution-list';

describe('PollutionList', () => {
  const url = `${environment.apiUrl}/pollutions`;
  const pollution: Pollution = {
    id: 1,
    title: 'Bouteilles sur la plage',
    type: 'plastic',
    description: 'Beaucoup de déchets',
    observedAt: '2026-05-01',
    location: 'Nice',
    latitude: 43.7,
    longitude: 7.26,
    photoUrl: null,
  };

  let fixture: ComponentFixture<PollutionList>;
  let el: HTMLElement;
  let http: HttpTestingController;

  const click = async (selector: string) => {
    el.querySelector<HTMLElement>(selector)!.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(PollutionList);
    el = fixture.nativeElement;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
    http.expectOne(url).flush([pollution]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('demande confirmation avant de supprimer', async () => {
    await click('.item app-button');

    expect(el.querySelector('app-confirm-dialog')!.textContent).toContain('Supprimer cette pollution ?');
    http.expectNone(`${url}/1`);
  });

  it("n'appelle pas l'API quand on annule", async () => {
    await click('.item app-button');
    await click('app-confirm-dialog .actions app-button:first-child');

    http.expectNone(`${url}/1`);
    expect(el.querySelector('app-confirm-dialog')).toBeNull();
    expect(el.textContent).toContain('Bouteilles sur la plage');
  });

  it('supprime la pollution quand on confirme', async () => {
    await click('.item app-button');
    await click('app-confirm-dialog .actions app-button:last-child');

    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await fixture.whenStable();

    expect(el.querySelector('app-confirm-dialog')).toBeNull();
    expect(el.textContent).not.toContain('Bouteilles sur la plage');
  });
});
