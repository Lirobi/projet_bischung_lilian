import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { SignUpRequest, User } from '../models/user.model';
import { UserApi } from './user-api';

describe('UserApi', () => {
  const url = `${environment.apiUrl}/users`;
  const request: SignUpRequest = {
    login: 'ada',
    lastName: 'Lovelace',
    firstName: 'Ada',
    email: 'ada@example.com',
    password: 'secret-123',
  };
  const created: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };

  let service: UserApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('récupère la liste avec GET /users', () => {
    let result: User[] | undefined;
    service.getAll().subscribe((list) => (result = list));

    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([created]);
    expect(result).toEqual([created]);
  });

  it('crée un utilisateur avec POST /users', () => {
    let result: User | undefined;
    service.create(request).subscribe((user) => (result = user));

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(created);
    expect(result).toEqual(created);
  });

  it('supprime un utilisateur avec DELETE /users/:id', () => {
    let done = false;
    service.delete(1).subscribe(() => (done = true));

    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    expect(done).toBe(true);
  });

  it('se connecte avec POST /users/login', () => {
    let result: User | undefined;
    service.login({ login: 'ada', password: 'secret-123' }).subscribe((user) => (result = user));

    const req = http.expectOne(`${url}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ login: 'ada', password: 'secret-123' });
    req.flush(created);
    expect(result).toEqual(created);
  });

  it("transmet les erreurs HTTP à l'appelant", () => {
    let status: number | undefined;
    service.create(request).subscribe({ error: (e) => (status = e.status) });

    http.expectOne(url).flush({ message: 'conflict' }, { status: 409, statusText: 'Conflict' });
    expect(status).toBe(409);
  });
});
