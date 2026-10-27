import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { SignUp } from './sign-up';

describe('SignUp feature', () => {
  let fixture: ComponentFixture<SignUp>;
  let el: HTMLElement;
  let http: HttpTestingController;

  const input = (label: string) =>
    [...el.querySelectorAll('app-text-field')]
      .find((f) => f.querySelector('label')!.textContent === label)!
      .querySelector<HTMLInputElement>('input')!;

  const type = async (label: string, value: string) => {
    const field = input(label);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };

  const fillValid = async () => {
    await type('Login', 'ada');
    await type('Nom', 'Lovelace');
    await type('Prénom', 'Ada');
    await type('E-mail', 'ada@example.com');
    await type('Mot de passe', 'secret-123');
    await type('Confirmer le mot de passe', 'secret-123');
  };

  const submit = async () => {
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    fixture = TestBed.createComponent(SignUp);
    el = fixture.nativeElement;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('does not call the API while the form is invalid and shows the errors', async () => {
    await submit();
    http.expectNone(`${environment.apiUrl}/users`);
    expect(el.textContent).toContain('Login requis.');
    expect(el.textContent).toContain('E-mail requis.');
  });

  it('flags mismatching passwords', async () => {
    await type('Mot de passe', 'secret-123');
    await type('Confirmer le mot de passe', 'autre-chose');
    expect(el.textContent).toContain('Les mots de passe diffèrent.');
  });

  it('sends the sign-up request without the confirmation and shows the created user', async () => {
    await fillValid();
    await submit();

    const req = http.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      login: 'ada',
      lastName: 'Lovelace',
      firstName: 'Ada',
      email: 'ada@example.com',
      password: 'secret-123',
    });
    req.flush({ id: 7, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' });
    await fixture.whenStable();

    expect(el.textContent).toContain('Compte créé');
    expect(el.textContent).toContain('#7');
    expect(el.querySelector('form')).toBeNull();
  });

  it('shows the server message on a 409 and keeps the form', async () => {
    await fillValid();
    await submit();
    http
      .expectOne(`${environment.apiUrl}/users`)
      .flush({ message: 'Ce login ou cet e-mail est déjà utilisé.' }, { status: 409, statusText: 'Conflict' });
    await fixture.whenStable();

    expect(el.querySelector('app-alert')!.textContent).toContain('déjà utilisé');
    expect(el.querySelector('form')).not.toBeNull();
  });

  it('explains when the server is unreachable', async () => {
    await fillValid();
    await submit();
    http.expectOne(`${environment.apiUrl}/users`).error(new ProgressEvent('error'));
    await fixture.whenStable();

    expect(el.querySelector('app-alert')!.textContent).toContain('Serveur injoignable');
  });
});
