import { NgClass } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [NgClass],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor {
  @Input() options: { value: any; label: string }[] = [];
  @Input() placeholder: string = '';
  @Input() name: string = '';

  selectedOption: { value: any; label: string } | null = null;
  isDropdownOpen: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.selectedOption =
      this.options.find((option) => option.value === value) || null;
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: { value: any; label: string }, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOption = option;
    this.isDropdownOpen = false;
    this.onChange(this.selectedOption.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
