import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatusService } from '@involvemint/client/shared/util';
import { OfferQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { UserFacade } from '../user.facade';
import * as OffersActions from './offers.actions';
import { OfferRestClient } from '../../rest-clients';

@Injectable()
export class OffersEffects {
  readonly loadOffersForProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.loadOffersForProfile),
      fetch({
        run: ({ profile }) =>
          this.offer
            .getForProfile(OfferQuery, { profileId: profile.id })
            .pipe(
              map((offers) => OffersActions.loadOffersForProfileSuccess({ offers, profileId: profile.id }))
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return OffersActions.loadOffersForProfileError({ error });
        },
      })
    )
  );

  readonly createOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.createOffer),
      delayWhen(() => from(this.status.showLoader('Creating...'))),
      pessimisticUpdate({
        run: ({ returnToEpStorefront }) =>
          this.user.session.selectors.activeProfile$.pipe(
            take(1),
            switchMap((profile) => this.offer.create(OfferQuery, { profileId: profile.id })),
            tap((offer) =>
              returnToEpStorefront
                ? this.route.to.ep.storefront.myOffers.EDIT(offer.id)
                : this.route.to.market.myOffers.EDIT(offer.id)
            ),
            map((offer) => OffersActions.createOfferSuccess({ offer }))
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return OffersActions.createOfferError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly updateOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.updateOffer),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.offer
            .update(OfferQuery, dto)
            .pipe(map((offer) => OffersActions.updateOfferSuccess({ offer }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return OffersActions.updateOfferError({ error });
        },
      })
    )
  );

  readonly deleteOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.deleteOffer),
      pessimisticUpdate({
        run: ({ offer, returnToEpStorefront }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to delete ${
                  offer.name ? '<b>' + offer.name + '</b>' : 'this offer'
                }?
              `,
              },
              buttonText: 'DELETE',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Deleting...'))),
            switchMap(() => this.offer.delete({ deletedId: true }, { offerId: offer.id })),
            tap(() =>
              returnToEpStorefront
                ? this.route.to.ep.storefront.ROOT({ queryParams: { activeTab: 'offers' } })
                : this.route.to.market.myOffers.ROOT()
            ),
            map(({ deletedId }) => OffersActions.deleteOfferSuccess({ deletedId }))
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return OffersActions.deleteOfferError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly uploadImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.uploadImages),
      delayWhen(() => from(this.status.showLoader('Starting...'))),
      pessimisticUpdate({
        run: ({ offer, images }) => {
          if (images.length < 1) {
            throw new Error('No images found.');
          }
          return this.offer.uploadImages(OfferQuery, { offerId: offer.id }, images).pipe(
            map((event) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  {
                    const progress = Math.round((100 * event.loaded) / (event.total ?? 1));
                    this.status.changeLoaderMessage(
                      `Uploading Offer Image${images.length > 1 ? 's' : ''}...${(progress ?? 0).toFixed(0)}%`
                    );
                  }
                  break;
                case HttpEventType.Response:
                  return event.body;
              }
              return undefined;
            }),
            filter((body) => !!body),
            map((offer) => {
              if (!offer) throw new Error('No Offer Emitted!');
              return OffersActions.updateOfferSuccess({ offer });
            })
          );
        },
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return OffersActions.uploadImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly deleteImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OffersActions.deleteImage),
      delayWhen(() => from(this.status.showLoader('Deleting...'))),
      pessimisticUpdate({
        run: ({ dto }) =>
          this.offer
            .deleteImage(OfferQuery, dto)
            .pipe(map((offer) => OffersActions.deleteImageSuccess({ offer }))),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return OffersActions.uploadImagesError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly offer: OfferRestClient,
    private readonly status: StatusService,
    private readonly user: UserFacade,
    private readonly route: RouteService
  ) {}
}
