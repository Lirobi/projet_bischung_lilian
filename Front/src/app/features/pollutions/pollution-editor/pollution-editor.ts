import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PollutionInput } from '../../../core/models/pollution.model';
import { PollutionApi } from '../../../core/services/pollution-api';
import { Alert } from '../../../shared/ui/alert';
import { httpErrorMessage } from '../http-error-message';
import { PollutionForm } from '../pollution-form/pollution-form';

/**
 * Page de déclaration (/pollutions/nouvelle) et de modification (/pollutions/:id/modifier).
 * Sans `id` dans l'URL on crée, sinon on charge la pollution puis on la modifie.
 */
@Component({
  selector: 'app-pollution-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PollutionForm, Alert],
  template: `
    @if (loadError(); as message) {
      <app-alert variant="error" title="Pollution introuvable">{{ message }}</app-alert>
    } @else if (!id() || initial()) {
      <app-pollution-form
        [heading]="id() ? 'Modifier la pollution' : 'Déclarer une pollution'"
        [submitLabel]="id() ? 'Enregistrer' : 'Déclarer'"
        [initial]="initial()"
        [loading]="saving()"
        [error]="saveError()"
        (submitted)="save($event)"
        (cancelled)="back()"
      />
    } @else {
      <p class="loading">Chargement…</p>
    }
  `,
  styles: `
    .loading {
      text-align: center;
      color: var(--foreground-muted);
    }
  `,
})
export class PollutionEditor implements OnInit {
  /** Paramètre de route, renseigné par `withComponentInputBinding`. */
  readonly id = input<string>();

  private readonly api = inject(PollutionApi);
  private readonly router = inject(Router);

  protected readonly initial = signal<PollutionInput | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.id();
    if (id) {
      this.api.getById(Number(id)).subscribe({
        next: (pollution) => this.initial.set(pollution),
        error: (error: HttpErrorResponse) => this.loadError.set(httpErrorMessage(error)),
      });
    }
  }

  protected save(pollution: PollutionInput): void {
    const id = this.id();
    const request = id ? this.api.update(Number(id), pollution) : this.api.create(pollution);

    this.saveError.set(null);
    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (saved) => this.router.navigate(['/pollutions', saved.id]),
      error: (error: HttpErrorResponse) => this.saveError.set(httpErrorMessage(error)),
    });
  }

  protected back(): void {
    const id = this.id();
    this.router.navigate(id ? ['/pollutions', id] : ['/pollutions']);
  }
}
