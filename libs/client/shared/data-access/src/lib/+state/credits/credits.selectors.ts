import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { creditsAdapter, CreditsState, CREDITS_KEY } from './credits.reducer';

const { selectAll } = creditsAdapter.getSelectors();

const getCreditsState = createFeatureSelector<CreditsState>(CREDITS_KEY);

export const getCreditsByProfile = (profile: ActiveProfile) =>
  createSelector(getCreditsState, (state: CreditsState) => ({
    credits: selectAll(state.credits).filter(
      (credit) =>
        (credit.changeMaker?.id === profile.id ||
          credit.servePartner?.id === profile.id ||
          credit.exchangePartner?.id === profile.id) &&
        !credit.escrow
    ),
    escrowCredits: selectAll(state.credits).filter(
      (credit) =>
        (credit.changeMaker?.id === profile.id ||
          credit.servePartner?.id === profile.id ||
          credit.exchangePartner?.id === profile.id) &&
        credit.escrow
    ),
    profileLoaded: state.profileLoaded,
  }));
