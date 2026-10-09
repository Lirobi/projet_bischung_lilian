import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pollution } from './pollution.model';

/**
 * Point d'entrée unique vers le backend.
 * Pour l'instant aucune API : on renvoie la déclaration telle quelle.
 * Le jour où l'API existe, il suffira de remplacer `of(...)` par
 * `this.http.post<Pollution>('/api/pollutions', pollution)` (HttpClient).
 */
@Injectable({ providedIn: 'root' })
export class PollutionService {
  declare(pollution: Pollution): Observable<Pollution> {
    return of(pollution);
  }
}
