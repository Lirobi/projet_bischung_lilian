import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

/**
 * Champ texte du design system (libellé, saisie, message d'erreur), utilisable
 * avec `formControlName`. Le type `password` ajoute le bouton afficher/masquer.
 */
@Component({
  selector: 'app-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextField), multi: true },
  ],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
})
export class TextField implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly autocomplete = input('off');
  readonly maxlength = input<number>();
  /** Message affiché sous le champ ; vide = pas d'erreur. */
  readonly error = input<string | null>(null);

  protected readonly id = `text-field-${nextId++}`;
  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);
  protected readonly revealed = signal(false);
  protected readonly inputType = computed(() =>
    this.type() === 'password' && this.revealed() ? 'text' : this.type(),
  );

  private onChange: (value: string) => void = () => {
    /* remplacé par registerOnChange */
  };
  private onTouched: () => void = () => {
    /* remplacé par registerOnTouched */
  };

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected toggleReveal(): void {
    this.revealed.update((v) => !v);
  }
}
