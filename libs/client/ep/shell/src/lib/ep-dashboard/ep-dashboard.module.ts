import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { ImCodeItemModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { EpDashboardComponent } from './ep-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImCodeItemModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    RouterModule.forChild([
      {
        path: '',
        component: EpDashboardComponent,
      },
    ]),
  ],
  declarations: [EpDashboardComponent],
})
export class EpDashboardModule {}
