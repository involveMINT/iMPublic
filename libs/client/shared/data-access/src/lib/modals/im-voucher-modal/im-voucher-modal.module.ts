import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImVoucherInfoModule } from '../../smart-components';
import { ImVoucherModalComponent } from './im-voucher-modal.component';
import { ImVoucherModalService } from './im-voucher-modal.service';

@NgModule({
  imports: [CommonModule, IonicModule, ImVoucherInfoModule],
  declarations: [ImVoucherModalComponent],
  providers: [ImVoucherModalService],
})
export class ImVoucherModalModule {}
export { ImVoucherModalService };
