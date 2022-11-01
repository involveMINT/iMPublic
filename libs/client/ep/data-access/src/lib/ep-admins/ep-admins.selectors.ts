import { createFeatureSelector, createSelector } from '@ngrx/store';
import { epAdminsAdapter, EpAdminsState, EP_ADMINS_KEY } from './ep-admins.reducer';

const getEpAdminsState = createFeatureSelector<EpAdminsState>(EP_ADMINS_KEY);

const { selectAll } = epAdminsAdapter.getSelectors();

export const getState = createSelector(getEpAdminsState, (state: EpAdminsState) => ({
  epAdmins: selectAll(state.epAdmins),
  profileLoaded: state.profilesLoaded,
}));
