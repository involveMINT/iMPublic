import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { parseOneFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { ModalController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { ChangeMakerFacade } from '../../change-maker.facade';
import { PassportDocumentStoreModel } from '../passport.reducer';

export interface PassportModalComponentInputs {
  title: string;
  header: string;
}

interface State {
  documents: PassportDocumentStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-passport-modal',
  templateUrl: './passport-modal.component.html',
  styleUrls: ['./passport-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportModalComponent
  extends StatefulComponent<State>
  implements OnInit, PassportModalComponentInputs {
  @ViewChild('fileInp') input!: ElementRef<HTMLInputElement>;

  @Input() title = '';
  @Input() header = '';

  constructor(
    private readonly cm: ChangeMakerFacade,
    private readonly status: StatusService,
    private readonly modal: ModalController
  ) {
    super({ documents: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.cm.passport.selectors.passport$.pipe(
        tap(({ documents, loaded }) => this.updateState({ documents, loaded }))
      )
    );

    this.effect(() =>
      this.cm.passport.actionListeners.createPassportDocument.success.pipe(
        tap(({ document }) => this.modal.dismiss(document))
      )
    );
  }

  selectDocument(document: PassportDocumentStoreModel) {
    return this.modal.dismiss(document);
  }

  close() {
    this.modal.dismiss(null);
  }

  createPassportDocument(event: Event) {
    let file: File | undefined;
    try {
      file = parseOneFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.cm.passport.dispatchers.createPassportDocument(file);
  }

  fileUploadButtonClick() {
    this.input.nativeElement.click();
  }
}
