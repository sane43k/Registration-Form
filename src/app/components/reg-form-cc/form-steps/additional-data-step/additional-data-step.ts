import { Component, inject, OnDestroy } from '@angular/core';
import {
  ControlContainer,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CustomInput } from '../../../form-controls/custom-input/custom-input';
import { Select } from '../../../form-controls/select/select';
import { TranslatePipe } from '../../../../pipes/translate-pipe';

@Component({
  selector: 'app-additional-data-step',
  imports: [CustomInput, Select, ReactiveFormsModule, TranslatePipe],
  templateUrl: './additional-data-step.html',
  styleUrl: './additional-data-step.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class AdditionalDataStep implements OnDestroy {
  isMinor: boolean = false;

  private destroy$ = new Subject<void>();
  private container = inject(ControlContainer);
  get form() {
    return this.container.control;
  }

  constructor() {
    this.initIsMinor();

    this.form
      ?.get('additionalData.birthday')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date) => this.toggleRepresentativeFields(date));
  }

  initIsMinor(): void {
    const birthdayValue = this.form?.get('additionalData.birthday')?.value;

    if (birthdayValue) {
      this.isMinor = this.calculateAge(birthdayValue) < 18;
    } else {
      this.isMinor = false;
    }
  }

  toggleRepresentativeFields(birthday: string): void {
    const repName = this.form?.get('additionalData.representativeName');
    const repEmail = this.form?.get('additionalData.representativeEmail');

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
