import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { calculateCreditsEarnedForPoi, PoiSpQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, tap } from 'rxjs/operators';
import * as PoisActions from './pois.actions';
import { PoiRestClient } from '@involvemint/client/shared/data-access';

@Injectable()
export class PoiEffects {
  readonly loadPoisByEnrollment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoisActions.loadPoisByProject),
      fetch({
        run: ({ projectId }) =>
          this.pois
            .getByProject(PoiSpQuery, { projectId })
            .pipe(map((pois) => PoisActions.loadPoisByProjectSuccess({ pois: pois, projectId }))),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return PoisActions.loadPoisByProjectError({ error });
        },
      })
    )
  );

  readonly approvePoi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoisActions.approvePoi),
      pessimisticUpdate({
        run: ({ poi }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `<div >Are you sure you want to approve this</br>Proof of Impact for <b>${(
                  calculateCreditsEarnedForPoi(poi) / 100
                ).toFixed(2)}</b> Credits?</div>`,
              },
              buttonText: 'APPROVE',
              buttonCssClass: 'im-alert-confirm',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Approving...'))),
            switchMap(() => this.pois.approve(PoiSpQuery, { poiId: poi.id })),
            map((poi) => PoisActions.approvePoiSuccess({ poi }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return PoisActions.approvePoiError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly pois: PoiRestClient,
    private readonly status: StatusService
  ) {}
}
