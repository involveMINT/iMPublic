import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassportDocumentStoreModel } from '../passport.reducer';
import { PassportModalComponent, PassportModalComponentInputs } from './passport-modal.component';

@Injectable()
export class PassportModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: PassportModalComponentInputs): Promise<PassportDocumentStoreModel | null> {
    const m = await this.modal.create({ component: PassportModalComponent, componentProps: inputs });
    await m.present();
    return (await m.onDidDismiss()).data;
  }
}
