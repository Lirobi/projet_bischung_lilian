import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user.model';
import { UserList } from './user-list';

describe('UserList', () => {
  const url = `${environment.apiUrl}/users`;
  const user: User = { id: 1, login: 'ada', lastName: 'Lovelace', firstName: 'Ada', email: 'ada@example.com' };

  let fixture: ComponentFixture<UserList>;
  let el: HTMLElement;
  let http: HttpTestingController;

  const click = async (selector: string) => {
    el.querySelector<HTMLElement>(selector)!.click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    fixture = TestBed.createComponent(UserList);
    el = fixture.nativeElement;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
    http.expectOne(url).flush([user]);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('demande confirmation avant de supprimer', async () => {
    await click('.item app-button');

    expect(el.querySelector('app-confirm-dialog')!.textContent).toContain('Supprimer cet utilisateur ?');
    http.expectNone(`${url}/1`);
  });

  it("n'appelle pas l'API quand on annule", async () => {
    await click('.item app-button');
    await click('app-confirm-dialog .actions app-button:first-child');

    http.expectNone(`${url}/1`);
    expect(el.querySelector('app-confirm-dialog')).toBeNull();
    expect(el.textContent).toContain('Ada Lovelace');
  });

  it("supprime l'utilisateur quand on confirme", async () => {
    await click('.item app-button');
    await click('app-confirm-dialog .actions app-button:last-child');

    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await fixture.whenStable();

    expect(el.textContent).not.toContain('Ada Lovelace');
  });
});
