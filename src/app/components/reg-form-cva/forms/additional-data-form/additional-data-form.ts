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
import { CustomInput } from '../../../form-controls/custom-input/custom-input';
import { Select } from '../../../form-controls/select/select';

@Component({
  selector: 'app-additional-data-form',
  imports: [CustomInput, Select, ReactiveFormsModule],
  templateUrl: './additional-data-form.html',
  styleUrl: './additional-data-form.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdditionalDataForm),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AdditionalDataForm),
      multi: true,
    },
  ],
})
export class AdditionalDataForm
  implements ControlValueAccessor, Validator, OnDestroy
{
  additionalDataForm: FormGroup;
  isMinor: boolean = false;

  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    this.additionalDataForm = this.fb.group({
      birthday: ['', Validators.required],
      gender: [''],
      address: [''],
      representativeName: [''],
      representativeEmail: [''],
    });

    this.additionalDataForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value);
        this.onValidatorChange();
      });

    this.additionalDataForm
      .get('birthday')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date) => {
        if (date) {
          this.toggleRepresentativeFields(date);
        }
      });
  }

  writeValue(value: any): void {
    if (value) {
      this.additionalDataForm.patchValue(value, { emitEvent: false });
    }
  }
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.additionalDataForm.disable()
      : this.additionalDataForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.additionalDataForm.valid
      ? null
      : { additionalDataInvalid: true };
  }
  registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  onBlur(): void {
    this.onTouched();
  }

  toggleRepresentativeFields(birthday: string): void {
    const repName = this.additionalDataForm?.get('representativeName');
    const repEmail = this.additionalDataForm?.get('representativeEmail');

    if (!repName || !repEmail) return;

    this.isMinor = this.calculateAge(birthday) < 18;

    if (this.isMinor) {
      repName.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[A-Za-z\s]{2,}$/),
      ]);
      repEmail.setValidators([Validators.required, Validators.email]);
    } else {
      repName.clearValidators();
      repEmail.clearValidators();
    }

    repName.updateValueAndValidity();
    repEmail.updateValueAndValidity();
  }

  calculateAge(birthday: string): number {
    if (!birthday) return 0;

    const today = new Date();
    const dateOfBirth = new Date(birthday);
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthsDifference = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthsDifference < 0 ||
      (monthsDifference === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }

    return age;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
