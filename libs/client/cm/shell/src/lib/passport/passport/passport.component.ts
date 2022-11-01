import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeMakerFacade, PassportDocumentStoreModel } from '@involvemint/client/cm/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { parseOneFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { tap } from 'rxjs/operators';

interface State {
  documents: PassportDocumentStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportComponent extends StatefulComponent<State> implements OnInit {
  @ViewChild('fileInp') input!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly cm: ChangeMakerFacade,
    private readonly status: StatusService,
    private readonly routes: RouteService
  ) {
    super({ documents: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.cm.passport.selectors.passport$.pipe(
        tap(({ documents, loaded }) => this.updateState({ documents, loaded }))
      )
    );
  }

  refresh() {
    this.cm.passport.dispatchers.refresh();
  }

  viewDocument(document: PassportDocumentStoreModel) {
    this.routes.to.cm.passport.DOCUMENT(document.id, { animation: 'forward' });
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
