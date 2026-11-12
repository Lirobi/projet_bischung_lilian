import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HighlightPollutionDirective } from '../../../shared/highlight-pollution.directive';
import { PollutionLevelPipe } from '../../../shared/pollution-level.pipe';

/** Démonstration de la pipe et de la directive (/pollutions/niveaux). */
@Component({
  selector: 'app-pollution-levels',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PollutionLevelPipe, HighlightPollutionDirective],
  templateUrl: './pollution-levels.html',
  styleUrl: './pollution-levels.css',
})
export class PollutionLevels {
  protected readonly indices = [0, 20, 21, 50, 51, 100, 101, 250];
}
