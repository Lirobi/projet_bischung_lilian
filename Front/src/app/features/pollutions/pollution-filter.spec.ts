import { Pollution } from '../../core/models/pollution.model';
import { EMPTY_FILTER, filterPollutions, isFilterActive } from './pollution-filter';

const base = {
  description: 'Description de test.',
  latitude: 48.58,
  longitude: 7.75,
  photoUrl: null,
};

const pollutions: Pollution[] = [
  { ...base, id: 1, title: 'Sacs plastiques', type: 'plastic', observedAt: '2026-09-01', location: 'Parc de l’Orangerie' },
  { ...base, id: 2, title: 'Fumée noire', type: 'air', observedAt: '2026-10-05', location: 'Port du Rhin' },
  { ...base, id: 3, title: 'Huile sur l’eau', type: 'water', observedAt: '2026-10-10', location: 'Quai des Bateliers' },
];

const ids = (list: Pollution[]) => list.map((p) => p.id);

describe('filterPollutions', () => {
  it('renvoie tout sans critère', () => {
    expect(ids(filterPollutions(pollutions, EMPTY_FILTER))).toEqual([1, 2, 3]);
  });

  it('cherche dans le titre et le lieu sans tenir compte des accents ni de la casse', () => {
    expect(ids(filterPollutions(pollutions, { ...EMPTY_FILTER, search: 'FUMEE' }))).toEqual([2]);
    expect(ids(filterPollutions(pollutions, { ...EMPTY_FILTER, search: 'orangerie' }))).toEqual([1]);
  });

  it('filtre sur plusieurs types', () => {
    expect(ids(filterPollutions(pollutions, { ...EMPTY_FILTER, types: ['air', 'water'] }))).toEqual([2, 3]);
  });

  it('filtre sur une période (bornes incluses)', () => {
    const result = filterPollutions(pollutions, { ...EMPTY_FILTER, from: '2026-10-01', to: '2026-10-05' });
    expect(ids(result)).toEqual([2]);
  });

  it('cumule les critères', () => {
    const result = filterPollutions(pollutions, { ...EMPTY_FILTER, types: ['plastic', 'air'], from: '2026-10-01' });
    expect(ids(result)).toEqual([2]);
  });
});

describe('isFilterActive', () => {
  it('ignore une recherche vide', () => {
    expect(isFilterActive({ ...EMPTY_FILTER, search: '  ' })).toBe(false);
    expect(isFilterActive({ ...EMPTY_FILTER, types: ['air'] })).toBe(true);
  });
});
