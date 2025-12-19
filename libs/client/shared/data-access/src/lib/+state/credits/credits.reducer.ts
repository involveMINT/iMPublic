import { Credit, CreditQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as CreditsActions from './credits.actions';

export const CREDITS_KEY = 'credits';

export type CreditStoreModel = IParser<Credit, typeof CreditQuery>;

export interface CreditsState {
  credits: EntityState<CreditStoreModel>;
  profileLoaded: string[];
}

export const creditsAdapter = createEntityAdapter<CreditStoreModel>();

const initialState: CreditsState = {
  credits: creditsAdapter.getInitialState(),
  profileLoaded: [],
};

export const CreditReducer = createReducer(
  initialState,
  on(
    CreditsActions.refreshCreditsForProfile,
    (state, { profile }): CreditsState => {
      return {
        ...state,
        profileLoaded: state.profileLoaded.filter((p) => p !== profile.id),
      };
    }
  ),
  on(
    CreditsActions.loadCreditsForProfileSuccess,
    (state, { credits, profileId }): CreditsState => {
      return {
        ...state,
        credits: creditsAdapter.upsertMany(credits, state.credits),
        profileLoaded: [...state.profileLoaded, profileId],
      };
    }
  )
);
