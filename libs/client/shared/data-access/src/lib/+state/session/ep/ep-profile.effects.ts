import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { ImConfig, UserQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { UserFacade } from '../../user.facade';
import * as EpProfileActions from './ep-profile.actions';
import { ExchangePartnerRestClient } from '../../../rest-clients';

@Injectable()
export class EpProfileEffects {
  readonly editEpProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpProfileActions.editEpProfile),
      pessimisticUpdate({
        run: ({ changes }) =>
          this.uf.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap((ep) => {
              if (!ep) {
                throw new Error('No ExchangePartner Profile Found!');
              }
              return this.ep.editProfile(UserQuery.exchangeAdmins.exchangePartner, {
                epId: ep.id,
                changes,
              });
            }),
            map((exchangePartner) => {
              return EpProfileActions.editEpProfileSuccess({ exchangePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpProfileActions.editEpProfileError({ error });
        },
      })
    )
  );

  readonly changeEpLogoFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpProfileActions.changeEpLogoFile),
      delayWhen(() => from(this.status.showLoader('Changing Logo File...0%'))),
      pessimisticUpdate({
        run: ({ file }) =>
          this.uf.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap((ep) => {
              if (!ep) throw new Error('No ExchangePartner Profile Found!');
              return this.ep.updateLogoFile(UserQuery.exchangeAdmins.exchangePartner, { epId: ep.id }, file);
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(`Changing Logo File...${(progress ?? 0).toFixed(0)}%`);
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((exchangePartner) => {
              if (!exchangePartner) throw new Error('No ExchangePartner Profile Emitted!');
              return EpProfileActions.changeEpLogoFileSuccess({ exchangePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpProfileActions.changeEpLogoFileError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly uploadEpImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpProfileActions.uploadEpImages),
      delayWhen(() => from(this.status.showLoader('Uploading Images...0%'))),
      pessimisticUpdate({
        run: ({ files }) =>
          this.uf.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap((ep) => {
              if (!ep) throw new Error('No ExchangePartner Profile Found!');
              if (files.length + ep.imagesFilePaths.length > ImConfig.maxImagesPerItem) {
                throw new Error('Maximum of 4 images can be uploaded');
              }

              return this.ep.uploadImages(UserQuery.exchangeAdmins.exchangePartner, { epId: ep.id }, files);
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(`Uploading Images...${(progress ?? 0).toFixed(0)}%`);
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((exchangePartner) => {
              if (!exchangePartner) throw new Error('No ExchangePartner Profile Emitted!');
              return EpProfileActions.uploadEpImagesSuccess({ exchangePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpProfileActions.uploadEpImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly deleteEpImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpProfileActions.deleteEpImage),
      delayWhen(() => from(this.status.showLoader('Deleting...'))),
      pessimisticUpdate({
        run: ({ imagesFilePathsIndex }) =>
          this.uf.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap((ep) => {
              if (!ep) {
                throw new Error('No ExchangePartner Profile Found!');
              }
              return this.ep.deleteImage(UserQuery.exchangeAdmins.exchangePartner, {
                epId: ep.id,
                imagesFilePathsIndex,
              });
            }),
            map((exchangePartner) => {
              return EpProfileActions.deleteEpImageSuccess({ exchangePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpProfileActions.deleteEpImageError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly ep: ExchangePartnerRestClient,
    private readonly status: StatusService,
    private readonly uf: UserFacade
  ) {}
}
