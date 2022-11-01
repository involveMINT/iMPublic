import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImViewProfileModalComponent, ImViewProfileModalInputs } from './im-view-profile-modal.component';

@Injectable()
export class ImViewProfileModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: ImViewProfileModalInputs) {
    const modal = await this.modal.create({
      component: ImViewProfileModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return (await modal.onDidDismiss()).data;
  }
}
