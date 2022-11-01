import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImVoucherInfoModule } from '@involvemint/client/shared/data-access';
import { ImCodeItemModule, ImTabsModule } from '@involvemint/client/shared/ui';
import { IonicModule } from '@ionic/angular';
import { VoucherComponent } from './voucher/voucher.component';
import { VouchersComponent } from './vouchers/vouchers.component';

@NgModule({
  declarations: [VouchersComponent, VoucherComponent],
  imports: [
    CommonModule,
    IonicModule,
    ImTabsModule,
    ImCodeItemModule,
    ImVoucherInfoModule,
    RouterModule.forChild([
      {
        path: '',
        component: VouchersComponent,
      },
      {
        path: `:id`,
        component: VoucherComponent,
      },
    ]),
  ],
})
export class VoucherModule {}
