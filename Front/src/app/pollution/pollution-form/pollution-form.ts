import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PollutionPanel } from '../pollution-panel/pollution-panel';
import { POLLUTION_TYPES, Pollution, PollutionType } from '../pollution.model';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MIN_YEAR = 1900;

/** Date ISO `yyyy-MM-dd` du jour, en heure locale. */
export function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date réelle (pas de 31/02), postérieure à 1900 et pas dans le futur. */
export const observationDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;
  if (!value) {
    return null; // géré par Validators.required
  }
  if (!ISO_DATE.test(value)) {
    return { date: true };
  }
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d ||
    y < MIN_YEAR
  ) {
    return { date: true };
  }
  return value > todayIso() ? { future: true } : null;
};

/** Refuse NaN / Infinity (un input number mal saisi renvoie null ou NaN). */
export const finiteNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === '') {
    return null; // géré par Validators.required
  }
  return typeof value === 'number' && Number.isFinite(value) ? null : { number: true };
};

const notBlank = Validators.pattern(/.*\S.*/s);

@Component({
  selector: 'app-pollution-form',
  imports: [ReactiveFormsModule, PollutionPanel],
  templateUrl: './pollution-form.html',
  styleUrl: './pollution-form.css',
})
export class PollutionForm {
  @Output() readonly declared = new EventEmitter<Pollution>();

  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly types = POLLUTION_TYPES;
  protected readonly today = todayIso();

  protected readonly form = this.fb.group({
    title: [
      '',
      [Validators.required, notBlank, Validators.minLength(3), Validators.maxLength(100)],
    ],
    type: this.fb.control<PollutionType | ''>('', Validators.required),
    description: [
      '',
      [Validators.required, notBlank, Validators.minLength(10), Validators.maxLength(1000)],
    ],
    observedAt: ['', [Validators.required, observationDate]],
    location: ['', [Validators.required, notBlank, Validators.maxLength(150)]],
    latitude: this.fb.control<number | null>(null, [
      Validators.required,
      finiteNumber,
      Validators.min(-90),
      Validators.max(90),
    ]),
    longitude: this.fb.control<number | null>(null, [
      Validators.required,
      finiteNumber,
      Validators.min(-180),
      Validators.max(180),
    ]),
    photoUrl: ['', Validators.pattern(/^\s*https?:\/\/\S+\s*$/i)],
  });

  /** Vrai si le champ est invalide et que l'utilisateur y a déjà touché. */
  protected showError(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.dirty || control.touched);
  }

  protected hasError(name: keyof typeof this.form.controls, error: string): boolean {
    return this.form.controls[name].hasError(error);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const photoUrl = v.photoUrl.trim();
    this.declared.emit({
      title: v.title.trim(),
      type: v.type as PollutionType,
      description: v.description.trim(),
      observedAt: v.observedAt,
      location: v.location.trim(),
      latitude: v.latitude!,
      longitude: v.longitude!,
      photoUrl: photoUrl || null,
    });
  }
}
