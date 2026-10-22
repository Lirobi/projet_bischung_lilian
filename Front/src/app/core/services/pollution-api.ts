import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pollution, PollutionInput } from '../models/pollution.model';

/** Appels HTTP de l'API CRUD des pollutions. L'URL de base dépend de l'environnement. */
@Injectable({ providedIn: 'root' })
export class PollutionApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pollutions`;

  getAll(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.url);
  }

  getById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.url}/${id}`);
  }

  create(pollution: PollutionInput): Observable<Pollution> {
    return this.http.post<Pollution>(this.url, pollution);
  }

  update(id: number, pollution: PollutionInput): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.url}/${id}`, pollution);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
