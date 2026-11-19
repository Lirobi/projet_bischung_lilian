import { Directive, computed, input } from '@angular/core';
import { PollutionLevel, pollutionLevel } from './pollution-level.pipe';

const COLORS: Record<PollutionLevel, string> = {
  Faible: 'lightgreen',
  Modérée: 'yellow',
  Élevée: 'orange',
  Dangereuse: 'red',
};

/** Colore le fond de l'élément selon l'indice de dangerosité : `<li [appHighlightPollution]="indice">`. */
@Directive({
  selector: '[appHighlightPollution]',
  host: { '[style.background-color]': 'color()' },
})
export class HighlightPollutionDirective {
  readonly appHighlightPollution = input<number | null | undefined>();

  protected readonly color = computed(() => {
    const level = pollutionLevel(this.appHighlightPollution());
    return level === '' ? null : COLORS[level];
  });
}
