import { createFeatureSelector, createSelector } from '@ngrx/store';
import { baPrivilegesAdapter, PRIVILEGES_FEATURE_KEY, State } from './privileges.reducer';

const getPrivilegesState = createFeatureSelector<State>(PRIVILEGES_FEATURE_KEY);

const { selectAll: selectAllEp } = baPrivilegesAdapter.getSelectors();

export const getState = createSelector(getPrivilegesState, (state: State) => ({
  baPrivileges: selectAllEp(state.baPrivileges),
  loaded: state.loaded,
}));
