import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignUpRequest, User } from '../models/user.model';

/** Appels HTTP de l'API des utilisateurs. L'URL de base dépend de l'environnement. */
@Injectable({ providedIn: 'root' })
export class UserApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  create(request: SignUpRequest): Observable<User> {
    return this.http.post<User>(this.url, request);
  }
}
