import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  exchangePartnersMarketAdapter,
  MarketState,
  MARKET_KEY,
  offersMarketAdapter,
  requestsMarketAdapter,
} from './market.reducer';

const {
  selectAll: selectAllEps,
  selectEntities: selectEntitiesEp,
} = exchangePartnersMarketAdapter.getSelectors();
const {
  selectAll: selectAllOffers,
  selectEntities: selectEntitiesOffers,
} = offersMarketAdapter.getSelectors();
const {
  selectAll: selectAllRequests,
  selectEntities: selectEntitiesRequests,
} = requestsMarketAdapter.getSelectors();

const getMarketState = createFeatureSelector<MarketState>(MARKET_KEY);

export const getExchangePartners = createSelector(getMarketState, (state: MarketState) => ({
  exchangePartners: selectAllEps(state.exchangePartners),
  loaded: state.epPagesLoaded > 0,
  pagesLoaded: state.epPagesLoaded,
}));

export const getExchangePartner = (epId: string) =>
  createSelector(getMarketState, (state: MarketState) => ({
    exchangePartner: selectEntitiesEp(state.exchangePartners)[epId],
  }));

export const getOffers = createSelector(getMarketState, (state: MarketState) => ({
  offers: selectAllOffers(state.offers),
  loaded: state.offersPagesLoaded > 0,
  pagesLoaded: state.offersPagesLoaded,
}));

export const getOffer = (offerId: string) =>
  createSelector(getMarketState, (state: MarketState) => ({
    offer: selectEntitiesOffers(state.offers)[offerId],
  }));

export const getRequests = createSelector(getMarketState, (state: MarketState) => ({
  requests: selectAllRequests(state.requests),
  loaded: state.requestsPagesLoaded > 0,
  pagesLoaded: state.requestsPagesLoaded,
}));

export const getRequest = (requestId: string) =>
  createSelector(getMarketState, (state: MarketState) => ({
    request: selectEntitiesRequests(state.requests)[requestId],
  }));
