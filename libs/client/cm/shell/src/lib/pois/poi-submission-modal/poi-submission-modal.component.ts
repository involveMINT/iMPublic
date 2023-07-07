import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'involvemint-poi-submission-modal',
    templateUrl: './poi-submission-modal.component.html',
    styleUrls: ['./poi-submission-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoiSubmissionModalComponent {

    constructor(private readonly modal: ModalController) { }

    close() {
        return this.modal.dismiss(false);
    }
}
