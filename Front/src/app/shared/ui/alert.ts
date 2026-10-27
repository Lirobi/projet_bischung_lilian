import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Message de retour (succès, erreur ou information) avec icône. */
@Component({
  selector: 'app-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      @if (variant() === 'good') {
        <path d="M8 12.5l3 3 5-6" />
      } @else {
        <path d="M9 9l6 6M15 9l-6 6" />
      }
    </svg>
    <div class="body">
      @if (title()) {
        <p class="title">{{ title() }}</p>
      }
      <ng-content />
    </div>
  `,
  styleUrl: './alert.css',
  host: {
    '[class]': 'variant()',
    '[attr.role]': "variant() === 'error' ? 'alert' : 'status'",
  },
})
export class Alert {
  readonly variant = input.required<'good' | 'error'>();
  readonly title = input<string>();
}
