import { Pollution, PollutionType } from '../../core/models/pollution.model';

export interface PollutionFilter {
  /** Recherché dans le titre, le lieu et la description (sans tenir compte de la casse ni des accents). */
  search: string;
  /** Types retenus ; liste vide = tous les types. */
  types: PollutionType[];
  /** Bornes de la date d'observation au format `yyyy-MM-dd` ; vide = pas de borne. */
  from: string;
  to: string;
}

export const EMPTY_FILTER: PollutionFilter = { search: '', types: [], from: '', to: '' };

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export function isFilterActive(filter: PollutionFilter): boolean {
  return filter.search.trim() !== '' || filter.types.length > 0 || filter.from !== '' || filter.to !== '';
}

/** Applique tous les critères : ils se cumulent. */
export function filterPollutions(pollutions: readonly Pollution[], filter: PollutionFilter): Pollution[] {
  const search = normalize(filter.search);

  return pollutions.filter((p) => {
    if (search && !normalize(`${p.title} ${p.location} ${p.description}`).includes(search)) {
      return false;
    }
    if (filter.types.length > 0 && !filter.types.includes(p.type)) {
      return false;
    }
    // Les dates ISO se comparent directement comme des chaînes.
    if (filter.from && p.observedAt < filter.from) {
      return false;
    }
    if (filter.to && p.observedAt > filter.to) {
      return false;
    }
    return true;
  });
}
