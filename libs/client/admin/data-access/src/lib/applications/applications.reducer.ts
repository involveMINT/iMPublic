import {
  EpApplication,
  EpApplicationQuery,
  SpApplication,
  SpApplicationQuery,
  IParser
} from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ApplicationsActions from './applications.actions';

export const APPLICATIONS_FEATURE_KEY = 'adminApplications';

export type EpApplicationStoreModel = IParser<EpApplication, typeof EpApplicationQuery>;
export type SpApplicationStoreModel = IParser<SpApplication, typeof SpApplicationQuery>;

export interface State {
  epApplications: EntityState<EpApplicationStoreModel>;
  spApplications: EntityState<SpApplicationStoreModel>;
  loaded: boolean; // has the Applications list been loaded
}

export const epApplicationsAdapter = createEntityAdapter<EpApplicationStoreModel>();
export const spApplicationsAdapter = createEntityAdapter<SpApplicationStoreModel>();

export const initialState: State = {
  epApplications: epApplicationsAdapter.getInitialState(),
  spApplications: spApplicationsAdapter.getInitialState(),
  loaded: false,
};

export const ApplicationsReducer = createReducer(
  initialState,
  on(
    ApplicationsActions.refreshApplications,
    (state): State => ({
      ...state,
      epApplications: epApplicationsAdapter.removeAll(state.epApplications),
      spApplications: spApplicationsAdapter.removeAll(state.spApplications),
      loaded: false,
    })
  ),
  on(
    ApplicationsActions.loadApplicationsSuccess,
    (state, { epApplications, spApplications }): State => ({
      ...state,
      epApplications: epApplicationsAdapter.setAll(epApplications, state.epApplications),
      spApplications: spApplicationsAdapter.setAll(spApplications, state.spApplications),
      loaded: true,
    })
  ),

  // Ep App
  on(
    ApplicationsActions.processEpApplicationSuccess,
    (state, { applicationId }): State => ({
      ...state,
      epApplications: epApplicationsAdapter.removeOne(applicationId, state.epApplications),
    })
  ),

  // Sp App
  on(
    ApplicationsActions.processSpApplicationSuccess,
    (state, { applicationId }): State => ({
      ...state,
      spApplications: spApplicationsAdapter.removeOne(applicationId, state.spApplications),
    })
  )
);
