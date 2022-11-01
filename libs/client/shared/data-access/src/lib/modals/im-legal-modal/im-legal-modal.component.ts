import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

export interface ImLegalModalInputs {
  type: 'terms' | 'privacy' | 'waiver';
}

@Component({
  selector: 'im-legal-modal',
  templateUrl: './im-legal-modal.component.html',
  styleUrls: ['./im-legal-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImLegalModalComponent implements ImLegalModalInputs {
  @Input() type: ImLegalModalInputs['type'] = 'terms';

  constructor(private readonly modal: ModalController) {}

  close() {
    this.modal.dismiss();
  }
}
