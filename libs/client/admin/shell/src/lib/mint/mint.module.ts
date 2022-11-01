import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ImBlockModule, ImHandleSearchModalModule } from '@involvemint/client/shared/data-access';
import { ImFormsModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MintComponent } from './mint.component';

@NgModule({
  declarations: [MintComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImBlockModule,
    ImTabsModule,
    ImFormsModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    ImHandleSearchModalModule,
    RouterModule.forChild([
      {
        path: '',
        component: MintComponent,
      },
    ]),
  ],
})
export class AdminMintModule {}
