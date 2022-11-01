import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImStorageUrlPipeModule } from '../../pipes';
import { ImHandleModule } from '../im-handle/im-handle.module';
import { ImVoucherInfoComponent } from './im-voucher-info.component';

@NgModule({
  imports: [CommonModule, IonicModule, ImStorageUrlPipeModule, ImHandleModule],
  exports: [ImVoucherInfoComponent],
  declarations: [ImVoucherInfoComponent],
})
export class ImVoucherInfoModule {}
