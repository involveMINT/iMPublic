import { Injectable } from '@angular/core';
import { CreditRestClient } from '@involvemint/client/shared/data-access';
import { StatusService } from '@involvemint/client/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, map, tap } from 'rxjs/operators';
import * as CreditsActions from './credits.actions';

@Injectable()
export class CreditsEffects {
  readonly loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreditsActions.mint),
      delayWhen(() => from(this.status.showLoader('Minting'))),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.creditClient.mint({}, dto).pipe(
            tap(async () => {
              await this.status.dismissLoader();
              await this.status.presentSuccess(`Credited @${dto.handle} ${(dto.amount / 100).toFixed(2)} CC`);
            }),
            map(() => CreditsActions.mintSuccess())
          ),
        onError: (action, error) => {
          this.status.dismissLoader();
          this.status.presentNgRxActionAlert(action, error);
          return CreditsActions.mintError({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly creditClient: CreditRestClient,
    private readonly status: StatusService
  ) {}
}
