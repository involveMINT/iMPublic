import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { ActiveProfile } from '../../+state/session/user-session.reducer';
import { UserFacade } from '../../+state/user.facade';
import {
  ImProfileSelectModalComponent,
  ImProfileSelectModalInputs,
} from './im-profile-select-modal.component';

@Injectable()
export class ImProfileSelectModalService {
  constructor(private readonly modal: ModalController, private readonly user: UserFacade) {}

  async open(inputs: ImProfileSelectModalInputs) {
    const state = await this.user.session.selectors.state$.pipe(take(1)).toPromise();

    let numOfProfiles = 0;
    let profile: ActiveProfile | undefined;

    if (state.changeMaker) {
      numOfProfiles++;
      profile = { ...state.changeMaker, type: 'cm' as const };
    }
    state.serveAdmins.forEach((s) => {
      numOfProfiles++;
      profile = { ...s.servePartner, type: 'sp' as const };
    });
    state.exchangeAdmins.forEach((s) => {
      numOfProfiles++;
      profile = { ...s.exchangePartner, type: 'ep' as const };
    });

    if (numOfProfiles === 1) {
      return profile;
    }

    const modal = await this.modal.create({
      component: ImProfileSelectModalComponent,
      componentProps: inputs,
    });
    await modal.present();
    return (await modal.onDidDismiss()).data as ActiveProfile | undefined;
  }
}
