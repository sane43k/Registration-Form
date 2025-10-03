import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { MOCK_NETWORK_REGISTRATION_DATA } from '../../constants/mock-data';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BasicDataForm } from './forms/basic-data-form/basic-data-form';
import { AdditionalDataForm } from './forms/additional-data-form/additional-data-form';
import { RulesConfirmationForm } from './forms/rules-confirmation-form/rules-confirmation-form';

@Component({
  selector: 'app-reg-form-cva',
  imports: [
    ReactiveFormsModule,
    BasicDataForm,
    AdditionalDataForm,
    RulesConfirmationForm,
  ],
  templateUrl: './reg-form-cva.html',
  styleUrl: './reg-form-cva.scss',
})
export class RegFormCva implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private storageKey: string = 'regFormData';

  regForm: FormGroup;
  currentStep: number = 0;
  isStepInvalid: boolean = false;

  constructor() {
    this.regForm = this.fb.group({
      basicData: [{}],
      additionalData: [{}],
      rulesConfirmation: [{}],
    });

    this.restoreFormData();

    this.regForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.checkValidation();
        // console.log('🚀 ~ this.isStepInvalid:', this.isStepInvalid);
        if (!this.isStepInvalid && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
      });

    console.log('-- Control Value Accessor used --');
  }

  restoreFormData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const formData = localStorage.getItem(this.storageKey);
      if (formData) {
        this.regForm.patchValue(JSON.parse(formData));
      }
    }
  }

  checkValidation(): void {
    const stepMap: Record<number, string> = {
      1: 'basicData',
      2: 'additionalData',
      3: 'rulesConfirmation',
    };

    this.isStepInvalid =
      this.regForm.get(stepMap[this.currentStep])?.invalid || false;
  }

  onChangeStep(key: string): void {
    switch (key) {
      case 'prev':
        if (this.currentStep > 0) {
          this.currentStep--;
        }
        break;
      case 'next':
        if (this.currentStep < 3) {
          this.currentStep++;
          if (this.currentStep === 1) {
            const fromSocialNetworks =
              localStorage.getItem('fromSocialNetworks');
            if (fromSocialNetworks === 'true') {
              localStorage.removeItem('fromSocialNetworks');
              this.regForm.reset();
            }
          }
        }
        break;
    }
    this.checkValidation();
  }

  getSocialNetworksInfo(): void {
    if (this.currentStep === 0) {
      this.regForm.patchValue({
        basicData: {
          name: MOCK_NETWORK_REGISTRATION_DATA.name,
          email: MOCK_NETWORK_REGISTRATION_DATA.email,
          country: MOCK_NETWORK_REGISTRATION_DATA.country,
          tel: MOCK_NETWORK_REGISTRATION_DATA.tel,
        },
        additionalData: {
          // birthday: MOCK_NETWORK_REGISTRATION_DATA.birthday,
        },
        rulesConfirmation: {},
      });

      localStorage.setItem('fromSocialNetworks', JSON.stringify(true));

      this.currentStep++;
      // if (
      //   this.regForm.get('basicData')?.valid &&
      //   this.regForm.get('additionalData')?.valid
      // ) {
      //   this.currentStep = 3;
      // } else if (this.regForm.get('basicData')?.valid) {
      //   this.currentStep = 2;
      // } else {
      //   this.currentStep = 1;
      // }
    }
    this.checkValidation();
  }

  onSubmit(): void {
    this.currentStep = 4;
    setTimeout(() => {
      this.regForm.reset();
      this.currentStep = 0;
      this.checkValidation();
    }, 3000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
