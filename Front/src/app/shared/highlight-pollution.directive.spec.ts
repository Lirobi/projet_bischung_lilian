import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HighlightPollutionDirective } from './highlight-pollution.directive';

@Component({
  imports: [HighlightPollutionDirective],
  template: `<p [appHighlightPollution]="index()">test</p>`,
})
class Host {
  readonly index = signal<number | null>(10);
}

describe('HighlightPollutionDirective', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const p: HTMLElement = fixture.nativeElement.querySelector('p');
    return { fixture, p };
  }

  it('applique la couleur de chaque niveau', async () => {
    const { fixture, p } = setup();
    const cases: [number, string][] = [
      [10, 'lightgreen'],
      [30, 'yellow'],
      [80, 'orange'],
      [150, 'red'],
    ];
    for (const [index, color] of cases) {
      fixture.componentInstance.index.set(index);
      fixture.detectChanges();
      expect(p.style.backgroundColor).toBe(color);
    }
  });

  it('se met à jour quand la valeur change', () => {
    const { fixture, p } = setup();
    expect(p.style.backgroundColor).toBe('lightgreen');
    fixture.componentInstance.index.set(101);
    fixture.detectChanges();
    expect(p.style.backgroundColor).toBe('red');
  });

  it('ne colore pas sans indice valide', () => {
    const { fixture, p } = setup();
    fixture.componentInstance.index.set(null);
    fixture.detectChanges();
    expect(p.style.backgroundColor).toBe('');
  });
});
