export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type PollutionType = (typeof POLLUTION_TYPES)[number];

/** Forme d'une déclaration, telle qu'elle sera envoyée à l'API. */
export interface Pollution {
  title: string;
  type: PollutionType;
  description: string;
  /** Date d'observation au format ISO `yyyy-MM-dd`. */
  observedAt: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
}
