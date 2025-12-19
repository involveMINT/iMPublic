import {
  ExchangePartner,
  ExchangePartnerMarketQuery,
  Offer,
  OfferMarketQuery,
  Request,
  RequestMarketQuery,
  IParser
} from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as MarketActions from './market.actions';

export const MARKET_KEY = 'market';

export type OfferMarketStoreModel = IParser<Offer, typeof OfferMarketQuery>;
export type RequestMarketStoreModel = IParser<Request, typeof RequestMarketQuery>;
export type ExchangePartnerMarketStoreModel = IParser<ExchangePartner, typeof ExchangePartnerMarketQuery>;

export interface MarketState {
  exchangePartners: EntityState<ExchangePartnerMarketStoreModel>;
  offers: EntityState<OfferMarketStoreModel>;
  requests: EntityState<RequestMarketStoreModel>;
  epPagesLoaded: number;
  offersPagesLoaded: number;
  requestsPagesLoaded: number;
}

export const exchangePartnersMarketAdapter = createEntityAdapter<ExchangePartnerMarketStoreModel>();
export const offersMarketAdapter = createEntityAdapter<OfferMarketStoreModel>();
export const requestsMarketAdapter = createEntityAdapter<RequestMarketStoreModel>();

const initialState: MarketState = {
  exchangePartners: exchangePartnersMarketAdapter.getInitialState(),
  epPagesLoaded: 0,
  offers: offersMarketAdapter.getInitialState(),
  offersPagesLoaded: 0,
  requests: requestsMarketAdapter.getInitialState(),
  requestsPagesLoaded: 0,
};

export const MarketReducer = createReducer(
  initialState,
  on(MarketActions.marketRefresh, (state): MarketState => {
    return {
      ...state,
      epPagesLoaded: 0,
      offersPagesLoaded: 0,
      requestsPagesLoaded: 0,
    };
  }),
  on(MarketActions.exchangePartnersMarketLoadSuccess, (state, { items }): MarketState => {
    return {
      ...state,
      exchangePartners: exchangePartnersMarketAdapter.upsertMany(items, state.exchangePartners),
      epPagesLoaded: 1,
    };
  }),
  on(MarketActions.getOneExchangePartnerSuccess, (state, { exchangePartner }): MarketState => {
    return {
      ...state,
      exchangePartners: exchangePartnersMarketAdapter.upsertOne(exchangePartner, state.exchangePartners),
    };
  }),
  on(MarketActions.offersMarketLoadSuccess, (state, { items, page }): MarketState => {
    return {
      ...state,
      offers: offersMarketAdapter.upsertMany(items, state.offers),
      offersPagesLoaded: page,
    };
  }),
  on(MarketActions.getOneOfferSuccess, (state, { offer }): MarketState => {
    return {
      ...state,
      offers: offersMarketAdapter.upsertOne(offer, state.offers),
    };
  }),
  on(MarketActions.requestsMarketLoadSuccess, (state, { items, page }): MarketState => {
    return {
      ...state,
      requests: requestsMarketAdapter.upsertMany(items, state.requests),
      requestsPagesLoaded: page,
    };
  }),
  on(MarketActions.getOneRequestSuccess, (state, { request }): MarketState => {
    return {
      ...state,
      requests: requestsMarketAdapter.upsertOne(request, state.requests),
    };
  })
);
