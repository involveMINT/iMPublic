import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { BudgetComponent } from './budget.component';

@NgModule({
  declarations: [BudgetComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImTabsModule,
    ImBlockModule,
    ImFormsModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    RouterModule.forChild([
      {
        path: '',
        component: BudgetComponent,
      },
    ]),
  ],
})
export class BudgetModule {}
