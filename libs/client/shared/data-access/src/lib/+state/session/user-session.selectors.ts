import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ActiveProfile,
  ExchangeAdminsWithBaDownloaded,
  UserSessionState,
  USER_SESSION_KEY,
} from './user-session.reducer';

const getUserSessionState = createFeatureSelector<UserSessionState>(USER_SESSION_KEY);

export const getState = createSelector(getUserSessionState, (state: UserSessionState) => state);

export const getEpAdminsWithBaDownloaded = createSelector(getUserSessionState, (state: UserSessionState) =>
  (state.exchangeAdmins as ExchangeAdminsWithBaDownloaded[]).filter((ea) => ea.baDownloaded)
);

export const getChangeMaker = createSelector(
  getUserSessionState,
  (state: UserSessionState) => state.changeMaker
);

export const getActiveProfile = createSelector(
  getUserSessionState,
  (state: UserSessionState): ActiveProfile => {
    if (state.changeMaker?.id === state.activeProfileId) {
      return { ...state.changeMaker, type: 'cm' as const };
    }

    const sp = state.serveAdmins.map((s) => ({ ...s.servePartner, type: 'sp' as const }));
    const ep = state.exchangeAdmins.map((s) => ({ ...s.exchangePartner, type: 'ep' as const }));
    const newActive = [...sp, ...ep].find((p) => p.id === state.activeProfileId);

    if (newActive) {
      return newActive;
    } else {
      console.warn(`Unable to activate profile for ID "${state.activeProfileId}". Reason: ID not found!'`);
      if (state.changeMaker) {
        console.warn('Defaulting to CM profile.');
        return { ...state.changeMaker, type: 'cm' as const };
      }
      return { type: 'none', id: '', handle: { id: '' } };
    }
  }
);
