import { Injectable } from '@angular/core';
import { InfoModalService, StatusService } from '@involvemint/client/shared/util';
import { TransactionQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from, of } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as CreditsActions from '../credits/credits.actions';
import { UserFacade } from '../user.facade';
import * as TransactionsActions from './transactions.actions';
import { TransactionRestClient } from '../../rest-clients';

@Injectable()
export class TransactionsEffects {
  readonly loadTransactionsForProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionsActions.loadTransactionsForProfile),
      fetch({
        run: ({ profile }) =>
          this.transactionClient
            .getForProfile(TransactionQuery, { profileId: profile.id })
            .pipe(
              map((transactions) =>
                TransactionsActions.loadTransactionsForProfileSuccess({ transactions, profileId: profile.id })
              )
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return TransactionsActions.loadTransactionsForProfileError({ error });
        },
      })
    )
  );

  readonly transaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TransactionsActions.transaction),
      pessimisticUpdate({
        run: ({ dto }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to send <b>${(dto.amount / 100).toFixed(
                  2
                )}</b> Credits from profile <b>@${dto.senderHandle}<b> to @<b>${dto.receiverHandle}</b>?`,
              },
              buttonText: 'SEND',
              buttonCssClass: 'im-alert-confirm',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Fulfilling Transaction...'))),
            switchMap(() => this.user.session.selectors.activeProfile$),
            take(1),
            switchMap((profile) =>
              this.transactionClient.transaction(TransactionQuery, dto).pipe(
                tap(() => this.status.dismissLoader()),
                delayWhen((transaction) =>
                  from(
                    this.infoModal.open({
                      title: 'Sent!',
                      description: `You have successfully sent ${(transaction.amount / 100).toFixed(
                        2
                      )} CommunityCredits to @${dto.receiverHandle}!`,
                      icon: { name: '/assets/icons/cc.svg', source: 'src' },
                      useBackground: false,
                    })
                  ).pipe(
                    take(1),
                    switchMap((m) => m.onDidDismiss())
                  )
                ),
                switchMap((transaction) =>
                  of(
                    TransactionsActions.transactionSuccess({ transaction }),
                    CreditsActions.refreshCreditsForProfile({ profile })
                  )
                )
              )
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return TransactionsActions.transactionError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly transactionClient: TransactionRestClient,
    private readonly status: StatusService,
    private readonly user: UserFacade,
    private readonly infoModal: InfoModalService
  ) {}
}
