import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AuthShell } from '../../shared/ui/auth-shell';
import { SignUp } from './sign-up';

/** Page /inscription (exercice 02). */
@Component({
  selector: 'app-sign-up-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthShell, SignUp],
  template: `
    <app-auth-shell title="Inscription">
      <app-sign-up [returnUrl]="returnUrl()" />
    </app-auth-shell>
  `,
})
export class SignUpPage {
  /** Page demandée avant la redirection vers l'inscription (query param `returnUrl`). */
  readonly returnUrl = input<string>();
}
