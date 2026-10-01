import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  protected user = {
    login: '',
    password: '',
    confirmPassword: '',
    lastName: '',
    firstName: '',
    email: '',
  };

  protected readonly submitted = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly showConfirm = signal(false);

  protected get passwordsMismatch(): boolean {
    return this.user.password !== this.user.confirmPassword;
  }

  protected restart(form: NgForm): void {
    form.resetForm();
    this.showPassword.set(false);
    this.showConfirm.set(false);
    this.submitted.set(false);
  }

  protected onSubmit(form: NgForm): void {
    if (form.invalid || this.passwordsMismatch) {
      return;
    }
    this.submitted.set(true);
  }
}
