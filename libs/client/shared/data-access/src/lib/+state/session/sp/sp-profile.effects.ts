import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { ImConfig, UserQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { UserFacade } from '../../user.facade';
import * as SpProfileActions from './sp-profile.actions';
import { ServePartnerRestClient } from '../../../rest-clients';

@Injectable()
export class SpProfileEffects {
  readonly editSpProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProfileActions.editSpProfile),
      pessimisticUpdate({
        run: ({ changes }) =>
          this.uf.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap((sp) => {
              if (!sp) {
                throw new Error('No ServePartner Profile Found!');
              }
              return this.sp.editProfile(UserQuery.serveAdmins.servePartner, {
                spId: sp.id,
                changes,
              });
            }),
            map((servePartner) => {
              return SpProfileActions.editSpProfileSuccess({ servePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProfileActions.editSpProfileError({ error });
        },
      })
    )
  );

  readonly changeSpLogoFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProfileActions.changeSpLogoFile),
      delayWhen(() => from(this.status.showLoader('Changing Logo File...0%'))),
      pessimisticUpdate({
        run: ({ file }) =>
          this.uf.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap((sp) => {
              if (!sp) throw new Error('No ServePartner Profile Found!');
              return this.sp.updateLogoFile(UserQuery.serveAdmins.servePartner, { spId: sp.id }, file);
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
            map((servePartner) => {
              if (!servePartner) throw new Error('No ServePartner Profile Emitted!');
              return SpProfileActions.changeSpLogoFileSuccess({ servePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProfileActions.changeSpLogoFileError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly uploadSpImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProfileActions.uploadSpImages),
      delayWhen(() => from(this.status.showLoader('Uploading Images...0%'))),
      pessimisticUpdate({
        run: ({ files }) =>
          this.uf.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap((sp) => {
              if (!sp) throw new Error('No ServePartner Profile Found!');
              if (files.length + sp.imagesFilePaths.length > ImConfig.maxImagesPerItem) {
                throw new Error('Maximum of 4 images can be uploaded');
              }

              return this.sp.uploadImages(UserQuery.serveAdmins.servePartner, { spId: sp.id }, files);
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
            map((servePartner) => {
              if (!servePartner) throw new Error('No ServePartner Profile Emitted!');
              return SpProfileActions.uploadSpImagesSuccess({ servePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProfileActions.uploadSpImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly deleteSpImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProfileActions.deleteSpImage),
      delayWhen(() => from(this.status.showLoader('Deleting...'))),
      pessimisticUpdate({
        run: ({ imagesFilePathsIndex }) =>
          this.uf.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap((sp) => {
              if (!sp) {
                throw new Error('No ServePartner Profile Found!');
              }
              return this.sp.deleteImage(UserQuery.serveAdmins.servePartner, {
                spId: sp.id,
                imagesFilePathsIndex,
              });
            }),
            map((servePartner) => {
              return SpProfileActions.deleteSpImageSuccess({ servePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProfileActions.deleteSpImageError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly sp: ServePartnerRestClient,
    private readonly status: StatusService,
    private readonly uf: UserFacade
  ) {}
}
