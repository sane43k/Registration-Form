import { Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TelMask } from '../../../directives/tel-mask';

@Component({
  selector: 'app-tel-input',
  imports: [TelMask],
  templateUrl: './tel-input.html',
  styleUrl: './tel-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TelInput),
      multi: true,
    },
    TelMask,
  ],
})
export class TelInput implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  value: string = '';

  private telMask = inject(TelMask);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = this.telMask.formatValue(value ?? '');
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.telMask.getDigitsOnly(this.value));
  }

  onBlur(): void {
    this.onTouched();
  }
}
