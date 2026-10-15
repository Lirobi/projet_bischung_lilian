import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AuthIllustration } from '../illustrations/auth-illustration';
import { Logo } from './logo';

/** Habillage des pages d'accès : logo, carte à deux volets (contenu + illustration). */
@Component({
  selector: 'app-auth-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthIllustration, Logo],
  template: `
    <app-logo class="anim-page-in" />
    <section class="card anim-page-in">
      <div class="content">
        <h1>{{ title() }}</h1>
        <ng-content />
      </div>
      <app-auth-illustration class="art" />
    </section>
  `,
  styleUrl: './auth-shell.css',
})
export class AuthShell {
  readonly title = input.required<string>();
}
