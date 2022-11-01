import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChangeMakerFacade, PassportDocumentStoreModel } from '@involvemint/client/cm/data-access';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { parseOneFile, StatefulComponent, StatusService } from '@involvemint/client/shared/util';
import { UnArray } from '@involvemint/shared/util';
import { FormControl } from '@ngneat/reactive-forms';
import { tap } from 'rxjs/operators';
import * as uuid from 'uuid';

interface State {
  document: PassportDocumentStoreModel | null;
  loaded: boolean;
  loadingRoute: string;
}

@Component({
  selector: 'involvemint-passport-document',
  templateUrl: './passport-document.component.html',
  styleUrls: ['./passport-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PassportDocumentComponent extends StatefulComponent<State> implements OnInit {
  readonly nameForm = new FormControl<string>('', (e) => Validators.required(e));

  @ViewChild('fileInp') fileInp!: ElementRef<HTMLInputElement>;
  @ViewChild('nameInp') nameInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly cf: ChangeMakerFacade,
    private readonly user: UserFacade,
    public readonly route: RouteService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly status: StatusService
  ) {
    super({ loaded: false, document: null, loadingRoute: '' });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }

    this.effect(() =>
      this.user.session.selectors.loadingRoute$.pipe(
        tap((loadingRoute) => this.updateState({ loadingRoute }))
      )
    );

    this.effect(() =>
      this.cf.passport.selectors.getPassportDocument(id).pipe(
        tap(({ document, loaded }) => {
          if (document) {
            this.nameForm.patchValue(document.name);
            this.nameForm.markAsPristine();
          }
          this.updateState({
            document: document
              ? {
                  ...document,
                  // Force imStorageUrl Pipe to reload.
                  filePath: `${document?.filePath}?rand=${uuid.v4()}`,
                }
              : document,
            loaded,
          });
        })
      )
    );
  }

  back() {
    return this.route.to.cm.passport.ROOT({ animation: 'back' });
  }

  editPassportDocument(document: PassportDocumentStoreModel) {
    this.cf.passport.dispatchers.editPassportDocument(document, this.nameForm.value);
  }

  editButton() {
    this.nameInput.nativeElement.focus();
  }

  deletePassportDocument(document: PassportDocumentStoreModel) {
    this.cf.passport.dispatchers.deletePassportDocument(document);
  }

  replacePassportDocument(event: Event, document: PassportDocumentStoreModel) {
    let file: File | undefined;
    try {
      file = parseOneFile(event);
    } catch (error) {
      this.status.presentAlert({ title: 'Error', description: error.message });
    }

    if (!file) return;

    this.cf.passport.dispatchers.replacePassportDocument(document, file);
  }

  replacePassportDocumentButtonClick() {
    this.fileInp.nativeElement.click();
  }

  viewProject(project: UnArray<PassportDocumentStoreModel['enrollmentDocuments']>['enrollment']['project']) {
    this.route.to.projects.COVER(project.id);
  }

  viewEnrollment(enrollment: UnArray<PassportDocumentStoreModel['enrollmentDocuments']>['enrollment']) {
    this.route.to.cm.enrollments.ENROLLMENT(enrollment.id);
  }

  open(url: string) {
    window.open(url, '_blank');
  }
}
