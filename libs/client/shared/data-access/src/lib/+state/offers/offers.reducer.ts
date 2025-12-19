import { Offer, OfferQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as OffersActions from './offers.actions';

export const OFFERS_KEY = 'offers';

export type OfferStoreModel = IParser<Offer, typeof OfferQuery>;

export interface OffersState {
  offers: EntityState<OfferStoreModel>;
  profileLoaded: string[];
}

export const offersAdapter = createEntityAdapter<OfferStoreModel>();

const initialState: OffersState = {
  offers: offersAdapter.getInitialState(),
  profileLoaded: [],
};

export const OfferReducer = createReducer(
  initialState,
  on(
    OffersActions.refreshOffersForProfile,
    (state, { profile }): OffersState => {
      return {
        ...state,
        profileLoaded: state.profileLoaded.filter((p) => p !== profile.id),
      };
    }
  ),
  on(
    OffersActions.loadOffersForProfileSuccess,
    (state, { offers, profileId }): OffersState => {
      return {
        ...state,
        offers: offersAdapter.upsertMany(offers, state.offers),
        profileLoaded: [...state.profileLoaded, profileId],
      };
    }
  ),
  on(
    OffersActions.createOfferSuccess,
    (state, { offer }): OffersState => {
      return {
        ...state,
        offers: offersAdapter.upsertOne(offer, state.offers),
      };
    }
  ),
  on(
    OffersActions.updateOfferSuccess,
    (state, { offer }): OffersState => {
      return {
        ...state,
        offers: offersAdapter.upsertOne(offer, state.offers),
      };
    }
  ),
  on(
    OffersActions.deleteOfferSuccess,
    (state, { deletedId }): OffersState => {
      return {
        ...state,
        offers: offersAdapter.removeOne(deletedId, state.offers),
      };
    }
  ),
  on(
    OffersActions.uploadImagesSuccess,
    (state, { offer }): OffersState => {
      return {
        ...state,
        offers: offersAdapter.upsertOne(offer, state.offers),
      };
    }
  ),
  on(
    OffersActions.deleteImageSuccess,
    (state, { offer }): OffersState => {
      return {
        ...state,
        offers: offersAdapter.upsertOne(offer, state.offers),
      };
    }
  )
);
