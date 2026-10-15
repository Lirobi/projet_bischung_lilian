import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignUpRequest, User } from '../models/user.model';

/** Encapsule les appels HTTP liés à l'inscription d'un utilisateur. */
@Injectable({ providedIn: 'root' })
export class SignUpApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/users`;

  signUp(request: SignUpRequest): Observable<User> {
    return this.http.post<User>(this.url, request);
  }
}
