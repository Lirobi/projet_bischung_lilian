import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Pollution } from '../../../core/models/pollution.model';
import { PollutionDetail } from './pollution-detail';

describe('PollutionDetail', () => {
  const url = `${environment.apiUrl}/pollutions/1`;
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

  let fixture: ComponentFixture<PollutionDetail>;
  let el: HTMLElement;
  let http: HttpTestingController;

  const click = async (selector: string) => {
    el.querySelector<HTMLElement>(selector)!.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '**', children: [] }])],
    });
    fixture = TestBed.createComponent(PollutionDetail);
    fixture.componentRef.setInput('id', '1');
    el = fixture.nativeElement;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
    http.expectOne(url).flush(pollution);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('demande confirmation avant de supprimer', async () => {
    await click('.actions app-button');

    expect(el.querySelector('app-confirm-dialog')!.textContent).toContain('Supprimer cette pollution ?');
    http.expectNone(url);
  });

  it("n'appelle pas l'API quand on annule", async () => {
    await click('.actions app-button');
    await click('app-confirm-dialog .actions app-button:first-child');

    http.expectNone(url);
    expect(el.querySelector('app-confirm-dialog')).toBeNull();
  });

  it('supprime la pollution et revient à la liste quand on confirme', async () => {
    await click('.actions app-button');
    await click('app-confirm-dialog .actions app-button:last-child');

    const req = http.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/pollutions');
  });
});
