import { createFeatureSelector, createSelector } from '@ngrx/store';
import { spAdminsAdapter, SpAdminsState, SP_ADMINS_KEY } from './sp-admins.reducer';

const getSpAdminsState = createFeatureSelector<SpAdminsState>(SP_ADMINS_KEY);

const { selectAll } = spAdminsAdapter.getSelectors();

export const getState = createSelector(getSpAdminsState, (state: SpAdminsState) => ({
  spAdmins: selectAll(state.spAdmins),
  profileLoaded: state.profilesLoaded,
}));
