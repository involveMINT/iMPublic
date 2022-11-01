import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  ImagesViewerComponentInputs,
  ImImagesViewerModalComponent,
} from './im-images-viewer-modal.component';

@Injectable()
export class ImImagesViewerModalService {
  constructor(private readonly modal: ModalController) {}

  async open(inputs: ImagesViewerComponentInputs) {
    const modal = await this.modal.create({
      component: ImImagesViewerModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return modal;
  }
}
