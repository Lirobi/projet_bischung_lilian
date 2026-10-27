import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { User } from '../../core/models/user.model';
import { SignUpApi } from '../../core/services/sign-up-api';
import { Alert } from '../../shared/ui/alert';
import { Button } from '../../shared/ui/button';
import { TextField } from '../../shared/ui/text-field';

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ' -]*$/;

/** Erreur `mismatch` sur le groupe si les deux mots de passe diffèrent. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

type FieldName = 'login' | 'lastName' | 'firstName' | 'email' | 'password' | 'confirmPassword';

/** Formulaire d'inscription : valide la saisie, appelle le service et affiche le résultat. */
@Component({
  selector: 'app-sign-up',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TextField, Button, Alert],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  private readonly api = inject(SignUpApi);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group(
    {
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[A-Za-z0-9._-]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(NAME_PATTERN)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(NAME_PATTERN)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  protected readonly loading = signal(false);
  protected readonly createdUser = signal<User | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  /** Se réévalue à chaque changement du formulaire (valeur, statut, touched, reset). */
  private readonly formEvents = toSignal(this.form.events, { initialValue: null });

  /** Message d'erreur par champ, affiché seulement après interaction ou tentative d'envoi. */
  protected readonly errors = computed<Record<FieldName, string | null>>(() => {
    this.formEvents();
    return {
      login: this.fieldError('login'),
      lastName: this.fieldError('lastName'),
      firstName: this.fieldError('firstName'),
      email: this.fieldError('email'),
      password: this.fieldError('password'),
      confirmPassword: this.fieldError('confirmPassword'),
    };
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { login, lastName, firstName, email, password } = this.form.getRawValue();
    this.errorMessage.set(null);
    this.loading.set(true);
    this.api
      .signUp({ login: login.trim(), lastName, firstName, email: email.trim(), password })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => this.createdUser.set(user),
        error: (error: HttpErrorResponse) => this.errorMessage.set(this.httpErrorMessage(error)),
      });
  }

  protected restart(): void {
    this.form.reset();
    this.createdUser.set(null);
    this.errorMessage.set(null);
  }

  private fieldError(name: FieldName): string | null {
    const control = this.form.controls[name];
    if (!control.touched && !control.dirty) {
      return null;
    }
    const e = control.errors ?? {};
    switch (name) {
      case 'login':
        if (e['required']) return 'Login requis.';
        if (e['minlength']) return '3 caractères minimum.';
        return e['pattern'] ? 'Lettres, chiffres, . _ - uniquement.' : null;
      case 'lastName':
      case 'firstName':
        if (e['required']) return name === 'lastName' ? 'Nom requis.' : 'Prénom requis.';
        if (e['minlength']) return '2 caractères minimum.';
        return e['pattern'] ? "Lettres, espaces, - et ' uniquement." : null;
      case 'email':
        if (e['required']) return 'E-mail requis.';
        return e['email'] ? 'Adresse e-mail invalide.' : null;
      case 'password':
        if (e['required']) return 'Mot de passe requis.';
        return e['minlength'] ? '8 caractères minimum.' : null;
      case 'confirmPassword':
        if (e['required']) return 'Confirmation requise.';
        return this.form.hasError('mismatch') ? 'Les mots de passe diffèrent.' : null;
    }
  }

  private httpErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Serveur injoignable. Vérifiez que l’API est démarrée.';
    }
    if (error.status === 409) {
      return error.error?.message ?? 'Ce login ou cet e-mail est déjà utilisé.';
    }
    return `Inscription impossible (erreur ${error.status}).`;
  }
}
