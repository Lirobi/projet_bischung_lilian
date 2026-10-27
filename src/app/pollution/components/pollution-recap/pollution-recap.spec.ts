import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pollution } from '../../models/pollution.model';
import { PollutionRecap } from './pollution-recap';

describe('PollutionRecap', () => {
  let fixture: ComponentFixture<PollutionRecap>;
  let el: HTMLElement;

  const pollution: Pollution = {
    title: 'Bidons abandonnés',
    type: 'chemical',
    description: 'Une dizaine de bidons au bord de la rivière.',
    observedAt: '2026-10-01',
    location: 'Quai des Bateliers, Strasbourg',
    latitude: 48.5734,
    longitude: 7.7521,
    photoUrl: null,
  };

  const render = async (p: Pollution) => {
    fixture.componentRef.setInput('pollution', p);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PollutionRecap] }).compileComponents();
    fixture = TestBed.createComponent(PollutionRecap);
    el = fixture.nativeElement;
  });

  it('displays every field received through @Input', async () => {
    await render(pollution);
    const text = el.textContent!;
    for (const expected of [
      'Bidons abandonnés',
      'Chimique',
      'Une dizaine de bidons au bord de la rivière.',
      '01/10/2026',
      'Quai des Bateliers, Strasbourg',
      '48.5734',
      '7.7521',
    ]) {
      expect(text).toContain(expected);
    }
  });

  it('shows no image without a photo URL', async () => {
    await render(pollution);
    expect(el.querySelector('img')).toBeNull();
  });

  it('shows the image when a photo URL is given', async () => {
    await render({ ...pollution, photoUrl: 'https://example.com/photo.jpg' });
    expect(el.querySelector('img')?.getAttribute('src')).toBe('https://example.com/photo.jpg');
  });

  it('emits restart when clicking "Nouvelle déclaration"', async () => {
    await render(pollution);
    let restarted = false;
    fixture.componentInstance.restart.subscribe(() => (restarted = true));
    el.querySelector<HTMLButtonElement>('button')!.click();
    expect(restarted).toBe(true);
  });
});
