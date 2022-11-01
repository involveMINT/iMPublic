import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent, InfoModalComponentProps } from './info-modal.component';

@Injectable()
export class InfoModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: InfoModalComponentProps) {
    const modal = await this.modal.create({
      component: InfoModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return modal;
  }
}
