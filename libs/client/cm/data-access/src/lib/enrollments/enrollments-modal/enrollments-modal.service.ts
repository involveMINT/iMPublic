import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  EnrollmentsModalComponent,
  EnrollmentsModalComponentInputs,
} from '../enrollments-modal/enrollments-modal.component';
import { EnrollmentStoreModel } from '../enrollments.reducer';

@Injectable()
export class EnrollmentsModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: EnrollmentsModalComponentInputs): Promise<EnrollmentStoreModel | null> {
    const m = await this.modal.create({ component: EnrollmentsModalComponent, componentProps: inputs });
    await m.present();
    return (await m.onDidDismiss()).data;
  }
}
