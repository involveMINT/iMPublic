import { Injectable } from '@angular/core';
import { ExchangeAdminRestClient, UserFacade } from '@involvemint/client/shared/data-access';
import { StatusService } from '@involvemint/client/shared/util';
import { EpAdminQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as EpAdminsActions from './ep-admins.actions';

@Injectable()
export class EpAdminsEffects {
  readonly loadEpAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpAdminsActions.loadEpAdmins),
      fetch({
        run: () =>
          this.user.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap(({ id: epId }) =>
              this.exchangeAdmin
                .getForExchangePartner(EpAdminQuery, { epId })
                .pipe(map((epAdmins) => EpAdminsActions.loadEpAdminsSuccess({ epAdmins, epId })))
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpAdminsActions.loadEpAdminsError({ error });
        },
      })
    )
  );

  readonly addEpAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpAdminsActions.addEpAdmin),
      delayWhen(() => from(this.status.showLoader('Adding Admin...'))),
      fetch({
        run: ({ userId }) =>
          this.user.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap(({ id }) =>
              this.exchangeAdmin
                .addAdmin(EpAdminQuery, { userId, epId: id })
                .pipe(map((epAdmin) => EpAdminsActions.addEpAdminSuccess({ epAdmin })))
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpAdminsActions.addEpAdminError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly removeEpAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpAdminsActions.removeEpAdmin),
      fetch({
        run: ({ epAdmin }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to revoke administrative privileges
                              for user <b>${epAdmin.user.id}</b>?`,
              },
              buttonText: 'REVOKE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Revoking...'))),
            switchMap(() => this.exchangeAdmin.removeAdmin({ deletedId: true }, { eaId: epAdmin.id })),
            map(({ deletedId }) => EpAdminsActions.removeEpAdminSuccess({ deletedId }))
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpAdminsActions.removeEpAdminError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly exchangeAdmin: ExchangeAdminRestClient,
    private readonly status: StatusService,
    private readonly user: UserFacade
  ) {}
}
