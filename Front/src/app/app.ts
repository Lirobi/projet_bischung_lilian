import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignUp } from './features/sign-up/sign-up';
import { AuthShell } from './shared/ui/auth-shell';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthShell, SignUp],
  template: `
    <app-auth-shell title="Inscription">
      <app-sign-up />
    </app-auth-shell>
  `,
})
export class App {}
