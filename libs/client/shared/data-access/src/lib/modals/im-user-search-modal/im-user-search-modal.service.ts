import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  ImUserSearchModalComponent,
  ImUserSearchModalInputs,
  UserSearchResult,
} from './im-user-search-modal.component';

@Injectable()
export class ImUserSearchModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: ImUserSearchModalInputs) {
    const modal = await this.modal.create({
      component: ImUserSearchModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return (await modal.onDidDismiss()).data as UserSearchResult | undefined;
  }
}
