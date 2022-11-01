import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'involvemint-im-welcome-modal',
  templateUrl: './im-welcome-modal.component.html',
  styleUrls: ['./im-welcome-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImWelcomeModalComponent {
  constructor(private readonly modal: ModalController, private readonly route: RouteService) {}

  close() {
    this.modal.dismiss();
  }

  cm() {
    this.route.to.applications.cm.ROOT();
    this.close();
  }

  ep() {
    this.route.to.applications.ep.ROOT();
    this.close();
  }

  sp() {
    this.route.to.applications.sp.ROOT();
    this.close();
  }
}
