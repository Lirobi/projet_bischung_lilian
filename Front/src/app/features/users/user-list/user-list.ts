import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserApi } from '../../../core/services/user-api';
import { Alert } from '../../../shared/ui/alert';
import { Button } from '../../../shared/ui/button';

/** Liste des utilisateurs inscrits (/utilisateurs). */
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Alert, Button],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private readonly api = inject(UserApi);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (list) => {
        this.users.set(list);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(
          error.status === 0
            ? 'Serveur injoignable. Vérifiez que l’API est démarrée.'
            : `Une erreur est survenue (code ${error.status}).`,
        );
        this.loading.set(false);
      },
    });
  }

  protected remove(user: User): void {
    this.error.set(null);
    this.deletingId.set(user.id);
    this.api.delete(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.deletingId.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(`La suppression a échoué (code ${error.status}).`);
        this.deletingId.set(null);
      },
    });
  }
}
