import { Component, forwardRef, inject, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Checkbox } from '../../../form-controls/checkbox/checkbox';

@Component({
  selector: 'app-rules-confirmation-form',
  imports: [Checkbox, ReactiveFormsModule],
  templateUrl: './rules-confirmation-form.html',
  styleUrl: './rules-confirmation-form.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RulesConfirmationForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RulesConfirmationForm),
      multi: true,
    },
  ],
})
export class RulesConfirmationForm
  implements ControlValueAccessor, Validator, OnDestroy
{
  rulesConfirmationForm: FormGroup;

  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private onChange: (value: any) => void = () => {};
  private OnTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    this.rulesConfirmationForm = this.fb.group({
      agreement: ['', Validators.requiredTrue],
      personalData: ['', Validators.requiredTrue],
      newsletter: [''],
    });

    this.rulesConfirmationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value);
        this.onValidatorChange();
      });
  }

  writeValue(value: any): void {
    if (value) {
      this.rulesConfirmationForm.patchValue(value, { emitEvent: false });
    }
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.OnTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.rulesConfirmationForm.disable()
      : this.rulesConfirmationForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.rulesConfirmationForm.valid
      ? null
      : { rulesConfirmationInvalid: true };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  onBlur(): void {
    this.OnTouched();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
