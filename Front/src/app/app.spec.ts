import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('renders the sign-up page inside the auth shell', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h1')?.textContent).toBe('Inscription');
    expect(el.querySelector('app-sign-up')).not.toBeNull();
    expect(el.querySelector('app-auth-illustration svg')).not.toBeNull();
  });
});
