import { Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { MOCK_NETWORK_REGISTRATION_DATA } from '../../constants/mock-data';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BasicDataStep } from './form-steps/basic-data-step/basic-data-step';
import { AdditionalDataStep } from './form-steps/additional-data-step/additional-data-step';
import { RulesConfirmationStep } from './form-steps/rules-confirmation-step/rules-confirmation-step';
import { TranslatePipe } from '../../pipes/translate-pipe';

@Component({
  selector: 'app-reg-form-cc',
  imports: [
    ReactiveFormsModule,
    BasicDataStep,
    AdditionalDataStep,
    RulesConfirmationStep,
    TranslatePipe,
  ],
  templateUrl: './reg-form-cc.html',
  styleUrl: './reg-form-cc.scss',
})
export class RegFormCc implements OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private storageKey: string = 'regFormData';

  regForm: FormGroup;
  currentStep: number = 0;
  isStepInvalid: boolean = false;
  userName: string = '';

  constructor() {
    this.regForm = this.fb.group({
      basicData: this.fb.group({
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[A-Za-z\s]{2,}$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        country: ['', Validators.required],
        tel: ['', Validators.pattern(/^[0-9]{7,17}$/)],
      }),
      additionalData: this.fb.group({
        birthday: ['', Validators.required],
        gender: [''],
        address: [''],
        representativeName: [''],
        representativeEmail: [''],
      }),
      rulesConfirmation: this.fb.group({
        agreement: ['', Validators.requiredTrue],
        personalData: ['', Validators.requiredTrue],
        newsletter: [''],
      }),
    });

    this.restoreFormData();

    this.regForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.checkValidation();
        if (!this.isStepInvalid && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
      });

    this.regForm
      .get('basicData.name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          const basicDataName = this.regForm.get('basicData.name');
          if (basicDataName?.valid) {
            this.userName = basicDataName?.value;
          }
        },
      });

    console.log('-- Control Container used --');
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
              localStorage.removeItem(this.storageKey);
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

      if (
        this.regForm.get('basicData')?.valid &&
        this.regForm.get('additionalData')?.valid
      ) {
        this.currentStep = 3;
      } else if (this.regForm.get('basicData')?.valid) {
        this.currentStep = 2;
      } else {
        this.currentStep = 1;
      }
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
