import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImLegalModalComponent, ImLegalModalInputs } from './im-legal-modal.component';

@Injectable()
export class ImLegalModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: ImLegalModalInputs) {
    const modal = await this.modal.create({ component: ImLegalModalComponent, componentProps: inputs });
    await modal.present();
    await modal.onDidDismiss();
  }
}
