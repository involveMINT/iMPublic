import { Injectable } from '@angular/core';
import { UserRestClient } from '@involvemint/client/shared/data-access';
import { StatusService } from '@involvemint/client/shared/util';
import { UserPrivilegeQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, tap } from 'rxjs/operators';
import * as PrivilegesActions from './privileges.actions';

@Injectable()
export class PrivilegesEffects {
  readonly loadPrivileges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegesActions.loadPrivileges),
      fetch({
        run: () =>
          this.user
            .getAllUserPrivileges(UserPrivilegeQuery)
            .pipe(map((baPrivileges) => PrivilegesActions.loadPrivilegesSuccess({ baPrivileges }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return PrivilegesActions.loadPrivilegesError({ error });
        },
      })
    )
  );

  readonly grantBAPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegesActions.grantBAPrivilege),
      pessimisticUpdate({
        run: ({ dto }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to grant BA privilege to user "<b>${dto.id}</b>"?`,
              },
              buttonText: 'Grant',
              buttonCssClass: 'im-alert-confirm',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Granting...'))),
            switchMap(() => this.user.grantBAPrivilege(UserPrivilegeQuery, dto)),
            map((user) => PrivilegesActions.grantBAPrivilegeSuccess({ user }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return PrivilegesActions.grantBAPrivilegeError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly revokeBAPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrivilegesActions.revokeBAPrivilege),
      pessimisticUpdate({
        run: ({ dto }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want revoke BA privilege from user "<b>${dto.id}</b>"?`,
              },
              buttonText: 'Revoke',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Revoking...'))),
            switchMap(() => this.user.revokeBAPrivilege(UserPrivilegeQuery, dto)),
            map((user) => PrivilegesActions.revokeBAPrivilegeSuccess({ user }))
          ),
        onError: (action, error) => {
          this.status.dismissLoader();
          this.status.presentNgRxActionAlert(action, error);
          return PrivilegesActions.revokeBAPrivilegeError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly user: UserRestClient,
    private readonly status: StatusService
  ) {}
}
