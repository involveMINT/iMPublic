import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { ExchangePartnerMarketQuery, OfferMarketQuery, RequestMarketQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';
import * as MarketActions from './market.actions';
import { ExchangePartnerRestClient, OfferRestClient, RequestRestClient } from '../../rest-clients';

@Injectable()
export class ProjectsEffects {
  readonly exchangePartnersMarketLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.exchangePartnersMarketLoad),
      fetch({
        run: () =>
          this.ep
            .query(ExchangePartnerMarketQuery, { distance: 10 })
            .pipe(map((items) => MarketActions.exchangePartnersMarketLoadSuccess({ items }))),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return MarketActions.exchangePartnersMarketLoadError({ error });
        },
      })
    )
  );

  readonly getOneExchangePartner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.getOneExchangePartner),
      fetch({
        run: ({ epId }) =>
          this.ep.getOne(ExchangePartnerMarketQuery, { epId }).pipe(
            map((exchangePartner) => {
              return MarketActions.getOneExchangePartnerSuccess({ exchangePartner });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return MarketActions.getOneExchangePartnerError({ error });
        },
      })
    )
  );

  readonly offersMarketLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.offersMarketLoad),
      fetch({
        run: ({ page }) =>
          this.offer
            .query(
              {
                ...OfferMarketQuery,
                __paginate: {
                  ...OfferMarketQuery.__paginate,
                  page,
                },
              },
              { distance: 10 }
            )
            .pipe(
              map((items) => {
                return MarketActions.offersMarketLoadSuccess({ items: items.items, page });
              })
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return MarketActions.offersMarketLoadError({ error });
        },
      })
    )
  );

  readonly getOneOffer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.getOneOffer),
      fetch({
        run: ({ offerId }) =>
          this.offer.getOne(OfferMarketQuery, { offerId }).pipe(
            map((offer) => {
              return MarketActions.getOneOfferSuccess({ offer });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return MarketActions.getOneOfferError({ error });
        },
      })
    )
  );

  readonly requestsMarketLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.requestsMarketLoad),
      fetch({
        run: ({ page }) =>
          this.request
            .query(
              {
                ...RequestMarketQuery,
                __paginate: {
                  ...RequestMarketQuery.__paginate,
                  page,
                },
              },
              { distance: 10 }
            )
            .pipe(
              map((items) => {
                return MarketActions.requestsMarketLoadSuccess({ items: items.items, page });
              })
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return MarketActions.requestsMarketLoadError({ error });
        },
      })
    )
  );

  readonly getOneRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MarketActions.getOneRequest),
      fetch({
        run: ({ requestId }) =>
          this.request.getOne(RequestMarketQuery, { requestId }).pipe(
            map((request) => {
              return MarketActions.getOneRequestSuccess({ request });
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return MarketActions.getOneRequestError({ error });
        },
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly ep: ExchangePartnerRestClient,
    private readonly offer: OfferRestClient,
    private readonly request: RequestRestClient,
    private readonly status: StatusService
  ) {}
}
