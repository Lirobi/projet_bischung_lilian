import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the form, then only the recap once a pollution is declared, then the form again', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-pollution-form form')).toBeTruthy();
    expect(el.querySelector('app-pollution-recap')).toBeNull();

    (fixture.componentInstance as any).onDeclared({
      title: 'Bidons',
      type: 'Chimique',
      description: 'Bidons abandonnés au bord de la rivière',
      observedAt: '2026-10-01',
      location: 'Strasbourg',
      latitude: 48.57,
      longitude: 7.75,
      photoUrl: null,
    });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('app-pollution-form')).toBeNull();
    expect(el.querySelector('app-pollution-recap h1')?.textContent).toContain('Bidons');

    el.querySelector<HTMLButtonElement>('app-pollution-recap button')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('app-pollution-form form')).toBeTruthy();
    expect(el.querySelector('app-pollution-recap')).toBeNull();
  });
});
