import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { offersAdapter, OffersState, OFFERS_KEY } from './offers.reducer';

const { selectAll, selectEntities } = offersAdapter.getSelectors();

const getOffersState = createFeatureSelector<OffersState>(OFFERS_KEY);

export const getOffersByProfile = (profile: ActiveProfile) =>
  createSelector(getOffersState, (state: OffersState) => ({
    offers: selectAll(state.offers).filter(
      (offer) =>
        offer.changeMaker?.id === profile.id ||
        offer.servePartner?.id === profile.id ||
        offer.exchangePartner?.id === profile.id
    ),
    profileLoaded: state.profileLoaded,
  }));

export const getOffer = (id: string) =>
  createSelector(getOffersState, (state: OffersState) => ({
    offer: selectEntities(state.offers)[id],
    profileLoaded: state.profileLoaded,
  }));
