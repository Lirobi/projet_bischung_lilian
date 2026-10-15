import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Bouton du design system : `primary` (plein) ou `outline` (contour). */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="btn"
      [class.outline]="variant() === 'outline'"
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
  readonly variant = input<'primary' | 'outline'>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly block = input(false);
}
