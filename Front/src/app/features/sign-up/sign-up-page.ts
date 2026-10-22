import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthShell } from '../../shared/ui/auth-shell';
import { SignUp } from './sign-up';

/** Page /inscription (exercice 02). */
@Component({
  selector: 'app-sign-up-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthShell, SignUp],
  template: `
    <app-auth-shell title="Inscription">
      <app-sign-up />
    </app-auth-shell>
  `,
})
export class SignUpPage {}
