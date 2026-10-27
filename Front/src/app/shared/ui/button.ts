import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Bouton du design system : `primary` (plein), `outline` (contour) ou `danger` (suppression). */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class.outline]="variant() === 'outline'"
      [class.danger]="variant() === 'danger'"
      [type]="type()"
      [disabled]="disabled() || loading()"
    >
      @if (loading()) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styleUrl: './button.css',
  host: { '[class.block]': 'block()' },
})
export class Button {
  readonly variant = input<'primary' | 'outline' | 'danger'>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly block = input(false);
}
