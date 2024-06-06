import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatusService } from '@involvemint/client/shared/util';
import { RequestQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { UserFacade } from '../user.facade';
import * as RequestsActions from './requests.actions';
import { RequestRestClient } from '../../rest-clients';

@Injectable()
export class RequestsEffects {
  readonly loadRequestsForProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.loadRequestsForProfile),
      fetch({
        run: ({ profile }) =>
          this.request
            .getForProfile(RequestQuery, { profileId: profile.id })
            .pipe(
              map((requests) =>
                RequestsActions.loadRequestsForProfileSuccess({ requests, profileId: profile.id })
              )
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return RequestsActions.loadRequestsForProfileError({ error });
        },
      })
    )
  );

  readonly createRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.createRequest),
      delayWhen(() => from(this.status.showLoader('Creating...'))),
      pessimisticUpdate({
        run: ({ returnToEpStorefront }) =>
          this.user.session.selectors.activeProfile$.pipe(
            take(1),
            switchMap((profile) => this.request.create(RequestQuery, { profileId: profile.id })),
            tap((request) =>
              returnToEpStorefront
                ? this.route.to.ep.storefront.myRequests.EDIT(request.id)
                : this.route.to.market.myRequests.EDIT(request.id)
            ),
            map((request) => RequestsActions.createRequestSuccess({ request }))
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return RequestsActions.createRequestError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.updateRequest),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.request
            .update(RequestQuery, dto)
            .pipe(map((request) => RequestsActions.updateRequestSuccess({ request }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return RequestsActions.updateRequestError({ error });
        },
      })
    )
  );

  readonly deleteRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.deleteRequest),
      pessimisticUpdate({
        run: ({ request, returnToEpStorefront }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to delete ${
                  request.name ? '<b>' + request.name + '</b>' : 'this request'
                }?
              `,
              },
              buttonText: 'DELETE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Deleting...'))),
            switchMap(() => this.request.delete({ deletedId: true }, { requestId: request.id })),
            tap(() =>
              returnToEpStorefront
                ? this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'requests' } })
                : this.route.to.market.myRequests.ROOT()
            ),
            map(({ deletedId }) => RequestsActions.deleteRequestSuccess({ deletedId }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return RequestsActions.deleteRequestError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly uploadImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.uploadImages),
      delayWhen(() => from(this.status.showLoader('Starting...'))),
      pessimisticUpdate({
        run: ({ request, images }) => {
          if (images.length < 1) {
            throw new Error('No images found.');
          }
          return this.request.uploadImages(RequestQuery, { requestId: request.id }, images).pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(
                      `Uploading Request Image${images.length > 1 ? 's' : ''}...${(progress ?? 0).toFixed(
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
            map((request) => {
              if (!request) throw new Error('No Request Emitted!');
              return RequestsActions.updateRequestSuccess({ request });
            })
          );
        },
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return RequestsActions.uploadImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly deleteImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RequestsActions.deleteImage),
      delayWhen(() => from(this.status.showLoader('Deleting...'))),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.request
            .deleteImage(RequestQuery, dto)
            .pipe(map((request) => RequestsActions.deleteImageSuccess({ request }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return RequestsActions.uploadImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly request: RequestRestClient,
    private readonly status: StatusService,
    private readonly user: UserFacade,
    private readonly route: RouteService
  ) {}
}
