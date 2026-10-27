import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Pollution } from '../../models/pollution.model';
import { PollutionForm, finiteNumber, observationDate, todayIso } from './pollution-form';

describe('PollutionForm', () => {
  let fixture: ComponentFixture<PollutionForm>;
  let el: HTMLElement;

  const set = async (id: string, value: string) => {
    const field = el.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      `#${id}`,
    )!;
    field.value = value;
    field.dispatchEvent(new Event(field.tagName === 'SELECT' ? 'change' : 'input'));
    field.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const submitBtn = () => el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  const fillValid = async () => {
    await set('title', 'Bidons abandonnés');
    await set('type', 'chemical');
    await set('description', '  Une dizaine de bidons au bord de la rivière.  ');
    await set('observedAt', '2026-10-01');
    await set('location', 'Quai des Bateliers, Strasbourg');
    await set('latitude', '48.5734');
    await set('longitude', '7.7521');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PollutionForm] }).compileComponents();
    fixture = TestBed.createComponent(PollutionForm);
    el = fixture.nativeElement;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('has all the fields with the right types', () => {
    const tag = (id: string) => el.querySelector<HTMLInputElement>(`#${id}`)!;
    expect(tag('title').type).toBe('text');
    expect(tag('type').tagName).toBe('SELECT');
    expect(tag('description').tagName).toBe('TEXTAREA');
    expect(tag('observedAt').type).toBe('date');
    expect(tag('location').type).toBe('text');
    expect(tag('latitude').type).toBe('number');
    expect(tag('longitude').type).toBe('number');
    expect(tag('photoUrl').type).toBe('url');
  });

  it('offers the 6 pollution types', () => {
    const options = [...el.querySelectorAll<HTMLOptionElement>('#type option:not([disabled])')];
    expect(options.map((o) => o.value)).toEqual([
      'plastic',
      'chemical',
      'illegal-dump',
      'water',
      'air',
      'other',
    ]);
    expect(options.map((o) => o.textContent!.trim())).toEqual([
      'Plastique',
      'Chimique',
      'Dépôt sauvage',
      'Eau',
      'Air',
      'Autre',
    ]);
  });

  it('locks submission while the form is empty', () => {
    expect(submitBtn().disabled).toBe(true);
  });

  it('enables submission once every required field is valid (photo optional)', async () => {
    await fillValid();
    expect(submitBtn().disabled).toBe(false);
  });

  it('emits a trimmed Pollution on submit, photo null when empty', async () => {
    let emitted: Pollution | undefined;
    fixture.componentInstance.declared.subscribe((p) => (emitted = p));
    await fillValid();
    submitBtn().click();
    expect(emitted).toEqual({
      title: 'Bidons abandonnés',
      type: 'chemical',
      description: 'Une dizaine de bidons au bord de la rivière.',
      observedAt: '2026-10-01',
      location: 'Quai des Bateliers, Strasbourg',
      latitude: 48.5734,
      longitude: 7.7521,
      photoUrl: null,
    });
  });

  it('rejects out-of-range coordinates', async () => {
    await fillValid();
    await set('latitude', '91');
    expect(submitBtn().disabled).toBe(true);
    expect(el.textContent).toContain('Entre -90 et 90.');
    await set('latitude', '48');
    await set('longitude', '-180.5');
    expect(submitBtn().disabled).toBe(true);
    expect(el.textContent).toContain('Entre -180 et 180.');
  });

  it('rejects an invalid photo URL but accepts a valid one', async () => {
    await fillValid();
    await set('photoUrl', 'pas-une-url');
    expect(submitBtn().disabled).toBe(true);
    await set('photoUrl', 'https://example.com/photo.jpg');
    expect(submitBtn().disabled).toBe(false);
  });

  it('rejects a blank title', async () => {
    await fillValid();
    await set('title', '     ');
    expect(submitBtn().disabled).toBe(true);
    expect(el.textContent).toContain('Titre requis.');
  });

  describe('observationDate validator', () => {
    const check = (value: string) => observationDate(new FormControl(value));

    it('accepts a real past date and today', () => {
      expect(check('2024-02-29')).toBeNull();
      expect(check(todayIso())).toBeNull();
    });

    it('rejects impossible or malformed dates', () => {
      expect(check('2023-02-29')).toEqual({ date: true });
      expect(check('2026-13-01')).toEqual({ date: true });
      expect(check('1850-01-01')).toEqual({ date: true });
      expect(check('01/10/2026')).toEqual({ date: true });
    });

    it('rejects a future date', () => {
      expect(check('2999-01-01')).toEqual({ future: true });
    });
  });

  describe('finiteNumber validator', () => {
    it('accepts finite numbers, rejects NaN and Infinity', () => {
      expect(finiteNumber(new FormControl(0))).toBeNull();
      expect(finiteNumber(new FormControl(-12.5))).toBeNull();
      expect(finiteNumber(new FormControl(NaN))).toEqual({ number: true });
      expect(finiteNumber(new FormControl(Infinity))).toEqual({ number: true });
    });
  });
});
