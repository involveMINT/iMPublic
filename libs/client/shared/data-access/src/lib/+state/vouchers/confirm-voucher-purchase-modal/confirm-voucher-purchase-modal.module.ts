import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImVoucherInfoModule } from '../../../smart-components';
import { ConfirmVoucherPurchaseModalComponent } from './confirm-voucher-purchase-modal.component';
import { ConfirmVoucherPurchaseModalService } from './confirm-voucher-purchase-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImVoucherInfoModule],
  declarations: [ConfirmVoucherPurchaseModalComponent],
  providers: [ConfirmVoucherPurchaseModalService],
})
export class ConfirmVoucherPurchaseModalModule {}
