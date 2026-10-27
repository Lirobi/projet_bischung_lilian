import { HttpErrorResponse } from '@angular/common/http';

/** Message lisible pour une erreur renvoyée par l'API des pollutions. */
export function httpErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Serveur injoignable. Vérifiez que l’API est démarrée.';
  }
  if (error.status === 404) {
    return 'Cette pollution n’existe pas ou a été supprimée.';
  }
  return `Une erreur est survenue (code ${error.status}).`;
}
