import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { requestsAdapter, RequestsState, REQUESTS_KEY } from './requests.reducer';

const { selectAll, selectEntities } = requestsAdapter.getSelectors();

const getRequestsState = createFeatureSelector<RequestsState>(REQUESTS_KEY);

export const getRequestsByProfile = (profile: ActiveProfile) =>
  createSelector(getRequestsState, (state: RequestsState) => ({
    requests: selectAll(state.requests).filter(
      (request) =>
        request.changeMaker?.id === profile.id ||
        request.servePartner?.id === profile.id ||
        request.exchangePartner?.id === profile.id
    ),
    profileLoaded: state.profileLoaded,
  }));

export const getRequest = (id: string) =>
  createSelector(getRequestsState, (state: RequestsState) => ({
    request: selectEntities(state.requests)[id],
    profileLoaded: state.profileLoaded,
  }));
