import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PoiSubmissionModalComponent } from './poi-submission-modal.component';

@Injectable()
export class PoiSubmissionModalService {
    constructor(private readonly modal: ModalController) { }

    async open(): Promise<boolean> {
        const m = await this.modal.create({ component: PoiSubmissionModalComponent });
        await m.present();
        return (await m.onDidDismiss()).data;
    }
}
