import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImStorageUrlPipeModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { EpOnboardingComponent } from './ep-onboarding.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImFormsModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    ImStorageUrlPipeModule,
    RouterModule.forChild([
      {
        path: '',
        component: EpOnboardingComponent,
      },
    ]),
  ],
  declarations: [EpOnboardingComponent],
})
export class EpOnboardingModule {}
