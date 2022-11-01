import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { ActiveProfile } from '../../+state/session/user-session.reducer';
import { UserFacade } from '../../+state/user.facade';

export interface ImProfileSelectModalInputs {
  title: string;
  header?: string;
}

interface State {
  myProfiles: ActiveProfile[];
  selectedProfile: ActiveProfile | null;
}

@Component({
  selector: 'im-profile-select-modal',
  templateUrl: './im-profile-select-modal.component.html',
  styleUrls: ['./im-profile-select-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImProfileSelectModalComponent
  extends StatefulComponent<State>
  implements OnInit, ImProfileSelectModalInputs {
  @Input() title = 'Select Profile';
  @Input() header?: string;

  constructor(private readonly user: UserFacade, private readonly modal: ModalController) {
    super({ myProfiles: [], selectedProfile: null });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.state$.pipe(
        tap((state) => {
          const myProfiles: ActiveProfile[] = [];

          if (state.changeMaker) {
            myProfiles.push({ ...state.changeMaker, type: 'cm' as const });
          }

          myProfiles.push(
            ...state.exchangeAdmins.map((ea) => ({
              ...ea.exchangePartner,
              type: 'ep' as const,
            }))
          );

          myProfiles.push(
            ...state.serveAdmins.map((sa) => ({
              ...sa.servePartner,
              type: 'sp' as const,
            }))
          );

          this.updateState({
            myProfiles,
            selectedProfile: myProfiles.find((p) => p.id === state.activeProfileId),
          });
        })
      )
    );
  }

  select() {
    this.modal.dismiss(this.state.selectedProfile ?? undefined);
  }

  close() {
    this.modal.dismiss(undefined);
  }

  selectProfile(selectedProfile: ActiveProfile) {
    this.updateState({ selectedProfile });
  }
}
