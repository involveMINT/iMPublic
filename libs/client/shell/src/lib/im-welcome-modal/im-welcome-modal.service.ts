import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImWelcomeModalComponent } from './im-welcome-modal.component';

@Injectable()
export class ImWelcomeModalService {
  constructor(private readonly modal: ModalController) {}

  async open() {
    const modal = await this.modal.create({
      component: ImWelcomeModalComponent,
      backdropDismiss: false
    });
    await modal.present();
    return modal.onDidDismiss();
  }
}
