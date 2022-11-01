import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnrollmentStoreModel } from '@involvemint/client/cm/data-access';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ModalController } from '@ionic/angular';

export interface SignWaiverModalComponentInputs {
  enrollment: EnrollmentStoreModel;
}

interface State {
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

  constructor(private readonly modal: ModalController) {
    super({ page: 'standard' });
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
