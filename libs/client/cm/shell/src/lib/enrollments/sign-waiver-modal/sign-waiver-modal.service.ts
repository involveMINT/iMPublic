import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignWaiverModalComponent, SignWaiverModalComponentInputs } from './sign-waiver-modal.component';

@Injectable()
export class SignWaiverModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: SignWaiverModalComponentInputs): Promise<boolean> {
    const m = await this.modal.create({ component: SignWaiverModalComponent, componentProps: inputs });
    await m.present();
    return (await m.onDidDismiss()).data;
  }
}
