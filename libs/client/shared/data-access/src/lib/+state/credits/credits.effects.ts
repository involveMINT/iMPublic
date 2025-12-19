import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { CreditQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import * as CreditsActions from './credits.actions';
import { CreditRestClient } from '../../rest-clients';

@Injectable()
export class CreditsEffects {
  readonly loadCreditsForProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CreditsActions.loadCreditsForProfile),
      fetch({
        run: ({ profile }) =>
          this.credit
            .getCreditsForProfile(CreditQuery, { profileId: profile.id })
            .pipe(
              map((credits) =>
                CreditsActions.loadCreditsForProfileSuccess({ credits, profileId: profile.id })
              )
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return CreditsActions.loadCreditsForProfileError({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly credit: CreditRestClient,
    private readonly status: StatusService
  ) {}
}
