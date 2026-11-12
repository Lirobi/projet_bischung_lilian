import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { UserApi } from '../../core/services/user-api';
import { Alert } from '../../shared/ui/alert';
import { AuthShell } from '../../shared/ui/auth-shell';
import { Button } from '../../shared/ui/button';
import { TextField } from '../../shared/ui/text-field';

/** Page /connexion : authentification fictive, sans session ni jeton. */
@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AuthShell, TextField, Button, Alert],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly api = inject(UserApi);
  private readonly auth = inject(Auth);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly loading = signal(false);
  protected readonly user = this.auth.user;
  protected readonly errorMessage = signal<string | null>(null);

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { login, password } = this.form.getRawValue();
    this.errorMessage.set(null);
    this.loading.set(true);
    this.api
      .login({ login: login.trim(), password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => this.auth.login(user),
        error: (error: HttpErrorResponse) =>
          this.errorMessage.set(
            error.status === 0
              ? 'Serveur injoignable. Vérifiez que l’API est démarrée.'
              : error.status === 401
                ? 'Login ou mot de passe incorrect.'
                : `Connexion impossible (erreur ${error.status}).`,
          ),
      });
  }

  protected logout(): void {
    this.form.reset();
    this.auth.logout();
    this.errorMessage.set(null);
  }
}
