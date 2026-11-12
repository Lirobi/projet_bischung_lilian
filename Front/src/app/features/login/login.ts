import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../core/services/auth';
import { UserApi } from '../../core/services/user-api';
import { safeReturnUrl } from '../../shared/return-url';
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
  /** Page demandée avant la redirection vers la connexion (query param `returnUrl`). */
  readonly returnUrl = input<string>();

  private readonly api = inject(UserApi);
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly loading = signal(false);
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
        next: (user) => {
          this.auth.login(user);
          this.router.navigateByUrl(this.destination());
        },
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

  /** Destination après connexion : `returnUrl` si c'est une URL interne, sinon les pollutions. */
  private destination(): string {
    return safeReturnUrl(this.returnUrl());
  }
}
