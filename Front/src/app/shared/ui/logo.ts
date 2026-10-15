import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Repère de marque : pastille bleue (goutte) + nom de l'application. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="12" class="tile" />
      <path class="drop" d="M22 9c0 0-9 9.5-9 16a9 9 0 0 0 18 0c0-6.5-9-16-9-16Z" />
      <path class="shine" d="M17.5 26a4.5 4.5 0 0 0 4 4.4" />
    </svg>
    <span>Pollution</span>
  `,
  styleUrl: './logo.css',
})
export class Logo {}
