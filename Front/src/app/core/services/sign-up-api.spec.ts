import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { SignUpRequest, User } from '../models/user.model';
import { SignUpApi } from './sign-up-api';

describe('SignUpApi', () => {
  const request: SignUpRequest = {
    login: 'ada',
    lastName: 'Lovelace',
    firstName: 'Ada',
    email: 'ada@example.com',
    password: 'secret-123',
  };

  let service: SignUpApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SignUpApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('POSTs the sign-up request to the configured API url', () => {
    const created: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };
    let result: User | undefined;

    service.signUp(request).subscribe((user) => (result = user));

    const req = http.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(created);
    expect(result).toEqual(created);
  });

  it('propagates HTTP errors to the caller', () => {
    let status: number | undefined;

    service.signUp(request).subscribe({ error: (e) => (status = e.status) });

    http.expectOne(`${environment.apiUrl}/users`).flush({ message: 'conflict' }, { status: 409, statusText: 'Conflict' });
    expect(status).toBe(409);
  });
});
