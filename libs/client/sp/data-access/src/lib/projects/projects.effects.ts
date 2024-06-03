import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EnrollmentRestClient,
  ProjectRestClient,
  UserFacade,
} from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatusService } from '@involvemint/client/shared/util';
import { ProjectSpQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as SpProjectsActions from './projects.actions';

@Injectable()
export class ProjectsEffects {
  readonly loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.loadProjects),
      fetch({
        run: () =>
          this.user.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap(({ id: spId }) =>
              this.project
                .getAllOwnedBySp(ProjectSpQuery, { spId })
                .pipe(map((projects) => SpProjectsActions.loadProjectsSuccess({ projects, spId })))
            )
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.loadProjectsError({ error });
        },
      })
    )
  );

  readonly createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.createProject),
      delayWhen(() => from(this.status.showLoader('Creating...'))),
      pessimisticUpdate({
        run: () =>
          this.user.session.selectors.activeProfileSp$.pipe(
            take(1),
            switchMap(({ id: spId }) => this.project.create(ProjectSpQuery, { spId })),
            delayWhen((project) => from(this.route.to.sp.myProjects.EDIT(project.id))),
            map((project) => SpProjectsActions.createProjectSuccess({ project }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.createProjectError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.updateProject),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.project
            .update(ProjectSpQuery, dto)
            .pipe(map((project) => SpProjectsActions.updateProjectSuccess({ project }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.updateProjectError({ error });
        },
      })
    )
  );

  readonly deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.deleteProject),
      pessimisticUpdate({
        run: ({ project }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to delete ${
                  project.title ? '<b>' + project.title + '</b>' : 'this project'
                }?
                `,
              },
              buttonText: 'DELETE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Deleting...'))),
            switchMap(() => this.project.delete({ deletedId: true }, { projectId: project.id })),
            tap(() => this.route.to.sp.myProjects.ROOT()),
            map(({ deletedId }) => SpProjectsActions.deleteProjectSuccess({ deletedId }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.deleteProjectError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly uploadImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.uploadImages),
      delayWhen(() => from(this.status.showLoader('Starting...'))),
      pessimisticUpdate({
        run: ({ project, images }) => {
          if (images.length < 1) {
            throw new Error('No images found.');
          }
          return this.project.uploadImages(ProjectSpQuery, { projectId: project.id }, images).pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(
                      `Uploading Project Image${images.length > 1 ? 's' : ''}...${(progress ?? 0).toFixed(
                        0
                      )}%`
                    );
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((project) => {
              if (!project) throw new Error('No Project Emitted!');
              return SpProjectsActions.updateProjectSuccess({ project });
            })
          );
        },
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.uploadImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly deleteImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.deleteImage),
      delayWhen(() => from(this.status.showLoader('Deleting...'))),
      pessimisticUpdate({
        run: ({ project, index }) =>
          this.project
            .deleteImage(ProjectSpQuery, { projectId: project.id, index })
            .pipe(map((project) => SpProjectsActions.deleteImageSuccess({ project }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.uploadImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly uploadCustomWaiver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpProjectsActions.uploadCustomWaiver),
      delayWhen(() => from(this.status.showLoader('Uploading Waiver...0%'))),
      pessimisticUpdate({
        run: ({ project, file }) => {
          return this.project.uploadCustomWaiver(ProjectSpQuery, { projectId: project.id }, file).pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(`Uploading Waiver...${(progress ?? 0).toFixed(0)}%`);
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((project) => {
              if (!project) throw new Error('No Project Emitted!');
              return SpProjectsActions.updateProjectSuccess({ project });
            })
          );
        },
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return SpProjectsActions.uploadCustomWaiverError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly project: ProjectRestClient,
    private readonly enrollment: EnrollmentRestClient,
    private readonly user: UserFacade,
    private readonly route: RouteService,
    private readonly status: StatusService
  ) {}
}
