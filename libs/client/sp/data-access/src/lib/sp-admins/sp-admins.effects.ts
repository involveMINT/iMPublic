import { Injectable } from '@angular/core';
import { ServeAdminRestClient, UserFacade } from '@involvemint/client/shared/data-access';
import { StatusService } from '@involvemint/client/shared/util';
import { SpAdminQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as SpAdminsActions from './sp-admins.actions';

@Injectable()
export class SpAdminsEffects {
  readonly loadSpAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpAdminsActions.loadSpAdmins),
      fetch({
        run: () =>
          this.user.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap(({ id: spId }) =>
              this.serveAdmin
                .getForServePartner(SpAdminQuery, { spId })
                .pipe(map((spAdmins) => SpAdminsActions.loadSpAdminsSuccess({ spAdmins, spId })))
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpAdminsActions.loadSpAdminsError({ error });
        },
      })
    )
  );

  readonly addSpAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpAdminsActions.addSpAdmin),
      delayWhen(() => from(this.status.showLoader('Adding Admin...'))),
      fetch({
        run: ({ userId }) =>
          this.user.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap(({ id }) =>
              this.serveAdmin
                .addAdmin(SpAdminQuery, { userId, spId: id })
                .pipe(map((spAdmin) => SpAdminsActions.addSpAdminSuccess({ spAdmin })))
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpAdminsActions.addSpAdminError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly removeSpAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpAdminsActions.removeSpAdmin),
      fetch({
        run: ({ spAdmin }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to revoke administrative privileges
                              for user <b>${spAdmin.user.id}</b>?`,
              },
              buttonText: 'REVOKE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Revoking...'))),
            switchMap(() => this.serveAdmin.removeAdmin({ deletedId: true }, { saId: spAdmin.id })),
            map(({ deletedId }) => SpAdminsActions.removeSpAdminSuccess({ deletedId }))
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpAdminsActions.removeSpAdminError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly serveAdmin: ServeAdminRestClient,
    private readonly status: StatusService,
    private readonly user: UserFacade
  ) {}
}
