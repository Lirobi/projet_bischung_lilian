import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, input, output } from '@angular/core';
import { Button } from './button';

/** Fenêtre de confirmation avant une action irréversible. Échap = annuler. */
@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <div class="backdrop">
      <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-message">
        <p id="confirm-message">{{ message() }}</p>
        <div class="actions">
          <app-button variant="outline" (click)="cancelled.emit()">Annuler</app-button>
          <app-button variant="danger" (click)="confirmed.emit()">{{ confirmLabel() }}</app-button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './confirm-dialog.css',
  host: { '(document:keydown.escape)': 'cancelled.emit()' },
})
export class ConfirmDialog {
  readonly message = input.required<string>();
  readonly confirmLabel = input('Supprimer');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    // Le focus démarre sur « Annuler » pour éviter une suppression par erreur.
    afterNextRender(() => host.nativeElement.querySelector('button')?.focus());
  }
}
