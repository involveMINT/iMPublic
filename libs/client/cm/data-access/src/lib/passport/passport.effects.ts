import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PassportDocumentRestClient, UserFacade } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatusService } from '@involvemint/client/shared/util';
import { DeletePassportDocumentQuery, PassportDocumentQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { EMPTY, from, of } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as PassportActions from './passport.actions';

@Injectable()
export class PassportEffects {
  readonly loadPassport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PassportActions.loadPassport),
      fetch({
        run: () =>
          this.user.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) => (cm ? this.passport.get(PassportDocumentQuery) : of([]))),
            take(1),
            map((documents) => {
              return PassportActions.loadPassportSuccess({ documents });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return PassportActions.loadPassportError({ error });
        },
      })
    )
  );

  readonly createPassportDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PassportActions.createPassportDocument),
      delayWhen(() => from(this.status.showLoader('Uploading...'))),
      pessimisticUpdate({
        run: ({ file }) =>
          this.user.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) => {
              if (!cm) throw new Error('No ChangeMaker Profile Found!');
              return this.passport.create(PassportDocumentQuery, file);
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(`Uploading...${(progress ?? 0).toFixed(0)}%`);
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((document) => {
              if (!document) throw new Error('No response on creating new Passport Document.');
              return PassportActions.createPassportDocumentSuccess({ document });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return PassportActions.createPassportDocumentError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly editPassportDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PassportActions.editPassportDocument),
      pessimisticUpdate({
        run: ({ document, newName }) =>
          this.user.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) => {
              if (!cm) throw new Error('No ChangeMaker Profile Found!');
              return this.passport.edit(PassportDocumentQuery, {
                documentId: document.id,
                name: newName,
              });
            }),
            map((document) => {
              if (!document) throw new Error('No response on creating new Passport Document.');
              return PassportActions.editPassportDocumentSuccess({ document });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return PassportActions.editPassportDocumentError({ error });
        },
      })
    )
  );

  readonly replacePassportDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PassportActions.replacePassportDocument),
      delayWhen(() => from(this.status.showLoader('Replacing...'))),
      pessimisticUpdate({
        run: ({ document, file }) =>
          this.user.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) => {
              if (!cm) throw new Error('No ChangeMaker Profile Found!');
              return this.passport.replace(PassportDocumentQuery, { documentId: document.id }, file);
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(`Replacing...${(progress ?? 0).toFixed(0)}%`);
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((document) => {
              if (!document) throw new Error('No response on creating new Passport Document.');
              return PassportActions.replacePassportDocumentSuccess({ document });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return PassportActions.replacePassportDocumentError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly deletePassportDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PassportActions.deletePassportDocument),
      pessimisticUpdate({
        run: ({ document }) => {
          if (document.enrollmentDocuments.length > 0) {
            this.status.presentAlert({
              title: `Unable to delete Passport Document ${document.name}`,
              description: `This Document is linked to one or more Enrollments (${document.enrollmentDocuments.length}).
              In order to delete this Document, you must first unlink this Document to all Enrollments.`,
            });
            return EMPTY;
          }

          return from(
            this.status.presentAlertWithAction({
              alertData: {
                title: `Delete Passport Document ${document.name}`,
                description: `Are you sure you want to delete your Passport Document ${document.name}?`,
              },
              buttonText: 'DELETE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Deleting...'))),
            switchMap(() => this.user.session.selectors.changeMaker$),
            take(1),
            switchMap((cm) => {
              if (!cm) throw new Error('No ChangeMaker Profile Found!');
              return this.passport.delete(DeletePassportDocumentQuery, { documentId: document.id });
            }),
            delayWhen(() => from(this.route.to.cm.passport.ROOT())),
            map(({ deletedId }) => {
              return PassportActions.deletePassportDocumentSuccess({ deletedId });
            })
          );
        },
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return PassportActions.deletePassportDocumentError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly passport: PassportDocumentRestClient,
    private readonly user: UserFacade,
    private readonly status: StatusService,
    private readonly route: RouteService
  ) {}
}
