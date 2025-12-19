import { Injectable } from '@angular/core';
import {
  EpApplicationRestClient,
  SpApplicationRestClient,
} from '@involvemint/client/shared/data-access';
import { StatusService } from '@involvemint/client/shared/util';
import { EpApplicationQuery, SpApplicationQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { forkJoin, from } from 'rxjs';
import { delayWhen, map, tap } from 'rxjs/operators';
import * as ApplicationsActions from './applications.actions';

@Injectable()
export class ApplicationsEffects {
  readonly loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.loadApplications),
      fetch({
        run: () =>
          forkJoin([this.epApp.findAll(EpApplicationQuery), this.spApp.findAll(SpApplicationQuery)]).pipe(
            map(([epApplications, spApplications]) =>
              ApplicationsActions.loadApplicationsSuccess({ epApplications, spApplications })
            )
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return ApplicationsActions.loadApplicationsError({ error });
        },
      })
    )
  );

  readonly processEpApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.processEpApplication),
      delayWhen(() => from(this.status.showLoader())),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.epApp.process({ deletedId: true }, dto).pipe(
            tap(async () => {
              this.status.dismissLoader();
              this.status.presentSuccess();
            }),
            map(() => ApplicationsActions.processEpApplicationSuccess({ applicationId: dto.id }))
          ),
        onError: (action, error) => {
          this.status.dismissLoader();
          this.status.presentNgRxActionAlert(action, error);
          return ApplicationsActions.processEpApplicationError({ error });
        },
      })
    )
  );

  readonly processSpApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.processSpApplication),
      delayWhen(() => from(this.status.showLoader())),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.spApp.process({ deletedId: true }, dto).pipe(
            tap(async () => {
              this.status.dismissLoader();
              this.status.presentSuccess();
            }),
            map(() => ApplicationsActions.processSpApplicationSuccess({ applicationId: dto.id }))
          ),
        onError: (action, error) => {
          this.status.dismissLoader();
          this.status.presentNgRxActionAlert(action, error);
          return ApplicationsActions.processSpApplicationError({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly epApp: EpApplicationRestClient,
    private readonly spApp: SpApplicationRestClient,
    private readonly status: StatusService
  ) {}
}
