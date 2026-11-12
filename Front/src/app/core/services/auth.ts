import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

const STORAGE_KEY = 'user';

/** Utilisateur connecté (connexion fictive). Gardé dans sessionStorage pour survivre à un rechargement. */
@Injectable({ providedIn: 'root' })
export class Auth {
  readonly user = signal<User | null>(this.restore());
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(user: User): void {
    this.user.set(user);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.user.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private restore(): User | null {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      return null;
    }
  }
}
