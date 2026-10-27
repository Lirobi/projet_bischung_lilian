import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Pollution, PollutionInput } from '../models/pollution.model';
import { PollutionApi } from './pollution-api';

describe('PollutionApi', () => {
  const url = `${environment.apiUrl}/pollutions`;
  const input: PollutionInput = {
    title: 'Bidons en bord de rivière',
    type: 'chemical',
    description: "Une dizaine de bidons d'huile abandonnés.",
    observedAt: '2026-10-12',
    location: 'Quai des Bateliers, Strasbourg',
    latitude: 48.58,
    longitude: 7.75,
    photoUrl: null,
  };
  const saved: Pollution = { id: 4, ...input };

  let service: PollutionApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PollutionApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('récupère la liste avec GET /pollutions', () => {
    let result: Pollution[] | undefined;
    service.getAll().subscribe((list) => (result = list));

    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([saved]);
    expect(result).toEqual([saved]);
  });

  it('récupère une pollution avec GET /pollutions/:id', () => {
    let result: Pollution | undefined;
    service.getById(4).subscribe((p) => (result = p));

    const req = http.expectOne(`${url}/4`);
    expect(req.request.method).toBe('GET');
    req.flush(saved);
    expect(result).toEqual(saved);
  });

  it('crée une pollution avec POST /pollutions', () => {
    service.create(input).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(input);
    req.flush(saved);
  });

  it('modifie une pollution avec PUT /pollutions/:id', () => {
    service.update(4, input).subscribe();

    const req = http.expectOne(`${url}/4`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(input);
    req.flush(saved);
  });

  it('supprime une pollution avec DELETE /pollutions/:id', () => {
    service.delete(4).subscribe();

    const req = http.expectOne(`${url}/4`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it("transmet les erreurs HTTP à l'appelant", () => {
    let status: number | undefined;
    service.getById(99).subscribe({ error: (e) => (status = e.status) });

    http.expectOne(`${url}/99`).flush({}, { status: 404, statusText: 'Not Found' });
    expect(status).toBe(404);
  });
});
