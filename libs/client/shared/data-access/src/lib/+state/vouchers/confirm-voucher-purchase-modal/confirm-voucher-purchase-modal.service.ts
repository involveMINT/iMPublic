import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  ConfirmVoucherPurchaseModalComponent,
  ConfirmVoucherPurchaseModalInputs,
} from './confirm-voucher-purchase-modal.component';

@Injectable()
export class ConfirmVoucherPurchaseModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: ConfirmVoucherPurchaseModalInputs) {
    const modal = await this.modal.create({
      component: ConfirmVoucherPurchaseModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return (await modal.onDidDismiss()).data as true | undefined;
  }
}
