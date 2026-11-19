import { CanDeactivateFn } from '@angular/router';

/** Composant qui sait dire s'il contient une saisie non enregistrée. */
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/** Demande confirmation avant de quitter une page dont la saisie n'est pas enregistrée. */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  !component.hasUnsavedChanges() || window.confirm('Quitter sans enregistrer les modifications ?');
