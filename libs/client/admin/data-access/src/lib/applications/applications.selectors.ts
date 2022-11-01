import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  APPLICATIONS_FEATURE_KEY,
  epApplicationsAdapter,
  spApplicationsAdapter,
  State,
} from './applications.reducer';

const getApplicationsState = createFeatureSelector<State>(APPLICATIONS_FEATURE_KEY);

const { selectAll: selectAllEp } = epApplicationsAdapter.getSelectors();
const { selectAll: selectAllSp } = spApplicationsAdapter.getSelectors();

export const getState = createSelector(getApplicationsState, (state: State) => ({
  epApplications: selectAllEp(state.epApplications),
  spApplications: selectAllSp(state.spApplications),
  loaded: state.loaded,
}));
