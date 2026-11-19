import { Pipe, PipeTransform } from '@angular/core';

export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

/** Indice de dangerosité vers statut : 0-20 Faible, 21-50 Modérée, 51-100 Élevée, 101+ Dangereuse. */
export function pollutionLevel(index: number | null | undefined): PollutionLevel | '' {
  if (index == null || Number.isNaN(index) || index < 0) {
    return '';
  }
  if (index <= 20) {
    return 'Faible';
  }
  if (index <= 50) {
    return 'Modérée';
  }
  if (index <= 100) {
    return 'Élevée';
  }
  return 'Dangereuse';
}

@Pipe({ name: 'pollutionLevel' })
export class PollutionLevelPipe implements PipeTransform {
  transform(index: number | null | undefined): PollutionLevel | '' {
    return pollutionLevel(index);
  }
}
