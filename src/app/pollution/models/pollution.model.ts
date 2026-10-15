/** Identifiants envoyés à l'API (indépendants de la langue d'affichage). */
export const POLLUTION_TYPES = [
  'plastic',
  'chemical',
  'illegal-dump',
  'water',
  'air',
  'other',
] as const;

export type PollutionType = (typeof POLLUTION_TYPES)[number];

/** Libellés affichés, séparés des identifiants. */
export const POLLUTION_TYPE_LABELS: Record<PollutionType, string> = {
  plastic: 'Plastique',
  chemical: 'Chimique',
  'illegal-dump': 'Dépôt sauvage',
  water: 'Eau',
  air: 'Air',
  other: 'Autre',
};

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
