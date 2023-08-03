import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocationPermissionModalComponent } from './location-permission-modal.component';

@Injectable()
export class LocationPermissionModalService {
  constructor(private readonly modal: ModalController) {}

  async open() {
    const modal = await this.modal.create({ component: LocationPermissionModalComponent, cssClass: 'location-permission-modal'});
    await modal.present();
    return modal.onDidDismiss();
  }
}
