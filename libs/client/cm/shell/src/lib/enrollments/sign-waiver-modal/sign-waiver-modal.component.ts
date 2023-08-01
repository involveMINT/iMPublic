import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnrollmentStoreModel } from '@involvemint/client/cm/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';

export interface SignWaiverModalComponentInputs {
  enrollment: EnrollmentStoreModel;
}

type CmProfile = NonNullable<UserStoreModel['changeMaker']>;
interface State {
  profile: CmProfile | null;
  page: 'standard' | 'custom';
}

@Component({
  selector: 'involvemint-sign-waiver-modal',
  templateUrl: './sign-waiver-modal.component.html',
  styleUrls: ['./sign-waiver-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignWaiverModalComponent
  extends StatefulComponent<State>
  implements SignWaiverModalComponentInputs
{
  @Input() enrollment!: EnrollmentStoreModel;

  constructor(private readonly modal: ModalController, private readonly user: UserFacade) {
    super({ profile: null, page: 'standard' });
  }

  ngOnInit() {
    this.effect(() =>
      this.user.session.selectors.changeMaker$.pipe(
        tap((changeMaker) => this.updateState({ profile: changeMaker }))
      )
    )
    // If the user has signed the general waiver, update the modal to display the custom waiver.
    // If there is no custom waiver, waiver should automatically be accepted (check enrollment.component.ts)
    this.effect(() =>
      this.user.session.selectors.changeMaker$.pipe(
        tap(() => {
          if ( this.state.profile?.hasSignedWaiver && this.state.page === 'standard' ) {
            this.updateState({ page: 'custom' });
          }
        })
      )
    )
  }

  deny() {
    return this.modal.dismiss(false);
  }

  accept() {
    if (!this.enrollment.project.requireCustomWaiver) {
      return this.modal.dismiss(true);
    }

    if (this.state.page === 'standard') {
      return this.updateState({ page: 'custom' });
    }

    return this.modal.dismiss(true);
  }

  next() {
    if (this.state.page === 'standard') {
      return this.updateState({ page: 'custom' });
    }

    return this.modal.dismiss(false);
  }
}
