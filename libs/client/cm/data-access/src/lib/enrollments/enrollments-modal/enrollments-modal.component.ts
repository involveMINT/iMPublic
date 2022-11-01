import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { ChangeMakerFacade } from '../../change-maker.facade';
import { EnrollmentStoreModel } from '../enrollments.reducer';

export interface EnrollmentsModalComponentInputs {
  title: string;
  header: string;
}

interface State {
  enrollments: EnrollmentStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-enrollments-modal',
  templateUrl: './enrollments-modal.component.html',
  styleUrls: ['./enrollments-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentsModalComponent
  extends StatefulComponent<State>
  implements OnInit, EnrollmentsModalComponentInputs {
  @Input() title = '';
  @Input() header = '';

  constructor(private readonly cm: ChangeMakerFacade, private readonly modal: ModalController) {
    super({ enrollments: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.cm.enrollments.selectors.enrollments$.pipe(
        tap(({ enrollments, loaded }) =>
          this.updateState({ enrollments: enrollments.filter((e) => !!e.dateApproved), loaded })
        )
      )
    );
  }

  selectEnrollment(enrollment: EnrollmentStoreModel) {
    return this.modal.dismiss(enrollment);
  }

  close() {
    this.modal.dismiss(null);
  }
}
