import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImVoucherModalComponent, ImVoucherModalInputs } from './im-voucher-modal.component';

@Injectable()
export class ImVoucherModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: ImVoucherModalInputs) {
    const modal = await this.modal.create({
      component: ImVoucherModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return (await modal.onDidDismiss()).data;
  }
}
