import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { ProjectFeedQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import * as ProjectActions from './projects.actions';
import { ProjectRestClient } from '../../rest-clients';

@Injectable()
export class MarketEffects {
  readonly projectsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.projectsLoad),
      fetch({
        run: ({ page }) =>
          this.projects
            .getAll(
              {
                ...ProjectFeedQuery,
                __paginate: {
                  ...ProjectFeedQuery.__paginate,
                  page,
                },
              },
              { distance: '10' }
            )
            .pipe(
              map((projects) => {
                return ProjectActions.projectsLoadSuccess({ items: projects.items, page });
              })
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return ProjectActions.projectsLoadError({ error });
        },
      })
    )
  );

  readonly getProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.getProject),
      fetch({
        run: (dto) =>
          this.projects.getOne(ProjectFeedQuery, dto).pipe(
            map((project) => {
              return ProjectActions.getProjectSuccess({ project });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return ProjectActions.getProjectError({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly projects: ProjectRestClient,
    private readonly status: StatusService
  ) {}
}
