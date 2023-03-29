import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UserFacade } from "@involvemint/client/shared/data-access";
import { StatefulComponent } from "@involvemint/client/shared/util";
import { ModalController } from "@ionic/angular";

interface State {

}

@Component({
    selector: 'app-modal-digest',
    templateUrl: './modal-digest.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDigestComponent extends StatefulComponent<State> implements OnInit {

    constructor(
        private readonly modalCtrl: ModalController,
        private readonly user: UserFacade
    ) { 
        super({})
    }

    ngOnInit(): void {
        
    }

    close() {
        return this.modalCtrl.dismiss(null, 'close');
    }

}