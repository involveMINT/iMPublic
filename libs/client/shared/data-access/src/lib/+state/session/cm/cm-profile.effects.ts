import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InfoModalService, StatusService } from '@involvemint/client/shared/util';
import { UserQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ChangeMakerRestClient } from '../../../rest-clients';
import { UserFacade } from '../../user.facade';
import * as CmProfileActions from './cm-profile.actions';

@Injectable()
export class CmProfileEffects {
  readonly editCmProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CmProfileActions.editCmProfile),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.uf.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) => {
              if (!cm) {
                throw new Error('No ChangeMaker Profile Found!');
              }
              return this.cm.editProfile(UserQuery.changeMaker, dto);
            }),
            map((changeMaker) => CmProfileActions.editCmProfileSuccess({ changeMaker }))
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return CmProfileActions.editCmProfileError({ error });
        },
      })
    )
  );

  readonly changeCmProfilePic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CmProfileActions.changeCmProfilePic),
      delayWhen(() => from(this.status.showLoader('Changing Profile Picture...0%'))),
      pessimisticUpdate({
        run: ({ file }) =>
          this.uf.session.selectors.changeMaker$.pipe(
            take(1),
            switchMap((cm) => {
              if (!cm) throw new Error('No ChangeMaker Profile Found!');
              return this.cm.updateProfileImage(UserQuery.changeMaker, file);
            }),
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(
                      `Changing Profile Picture...${(progress ?? 0).toFixed(0)}%`
                    );
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((changeMaker) => {
              if (!changeMaker) throw new Error('No ChangeMaker Profile Emitted!');
              return CmProfileActions.changeCmProfilePicSuccess({ changeMaker });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return CmProfileActions.changeCmProfilePicError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly cm: ChangeMakerRestClient,
    private readonly uf: UserFacade,
    private readonly status: StatusService,
    private readonly infoModal: InfoModalService
  ) {}
}
