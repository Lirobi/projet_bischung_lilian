import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let fixture: ComponentFixture<ConfirmDialog>;
  let el: HTMLElement;
  let confirmed = 0;
  let cancelled = 0;

  beforeEach(async () => {
    confirmed = 0;
    cancelled = 0;
    fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('message', 'Supprimer cette pollution ?');
    fixture.componentInstance.confirmed.subscribe(() => confirmed++);
    fixture.componentInstance.cancelled.subscribe(() => cancelled++);
    el = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('met le focus sur Annuler', () => {
    expect(document.activeElement).toBe(el.querySelector('button'));
    expect(document.activeElement?.textContent).toContain('Annuler');
  });

  it('annule avec la touche Échap', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(cancelled).toBe(1);
    expect(confirmed).toBe(0);
  });

  it('confirme avec le bouton Supprimer', () => {
    el.querySelectorAll('button')[1].click();
    expect(confirmed).toBe(1);
  });
});
