import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user.model';
import { Auth } from '../../core/services/auth';
import { Login } from './login';

describe('Login : retour vers la page demandée', () => {
  const user: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  const connect = async (returnUrl?: string) => {
    fixture.componentRef.setInput('returnUrl', returnUrl);
    const el: HTMLElement = fixture.nativeElement;
    const fill = (index: number, value: string) => {
      const input = el.querySelectorAll('input')[index];
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    fill(0, 'ada');
    fill(1, 'secret-123');
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    http.expectOne(`${environment.apiUrl}/users/login`).flush(user);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
  });

  it("renvoie vers l'URL demandée après la connexion", async () => {
    await connect('/pollutions/nouvelle');
    expect(TestBed.inject(Auth).isLoggedIn()).toBe(true);
    expect(navigateByUrl).toHaveBeenCalledWith('/pollutions/nouvelle');
  });

  it('renvoie vers les pollutions sans returnUrl', async () => {
    await connect();
    expect(navigateByUrl).toHaveBeenCalledWith('/pollutions');
  });

  it('ignore un returnUrl vers un autre site', async () => {
    await connect('//example.com');
    expect(navigateByUrl).toHaveBeenCalledWith('/pollutions');
  });
});
