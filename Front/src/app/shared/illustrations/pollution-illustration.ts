import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Illustration décorative des pages pollution : bandeau sur mobile, colonne de droite dès 768px. */
@Component({
  selector: 'app-pollution-illustration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pollution-illustration.html',
  styleUrl: './pollution-illustration.css',
  host: { 'aria-hidden': 'true' },
})
export class PollutionIllustration {}
