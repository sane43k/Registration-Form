import { Component, inject } from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { Checkbox } from '../../../form-controls/checkbox/checkbox';
import { TranslatePipe } from '../../../../pipes/translate-pipe';

@Component({
  selector: 'app-rules-confirmation-step',
  imports: [Checkbox, ReactiveFormsModule, TranslatePipe],
  templateUrl: './rules-confirmation-step.html',
  styleUrl: './rules-confirmation-step.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class RulesConfirmationStep {}
