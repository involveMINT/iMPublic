import { Request, RequestQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as RequestsActions from './requests.actions';

export const REQUESTS_KEY = 'requests';

export type RequestStoreModel = IParser<Request, typeof RequestQuery>;

export interface RequestsState {
  requests: EntityState<RequestStoreModel>;
  profileLoaded: string[];
}

export const requestsAdapter = createEntityAdapter<RequestStoreModel>();

const initialState: RequestsState = {
  requests: requestsAdapter.getInitialState(),
  profileLoaded: [],
};

export const RequestReducer = createReducer(
  initialState,
  on(
    RequestsActions.refreshRequestsForProfile,
    (state, { profile }): RequestsState => {
      return {
        ...state,
        profileLoaded: state.profileLoaded.filter((p) => p !== profile.id),
      };
    }
  ),
  on(
    RequestsActions.loadRequestsForProfileSuccess,
    (state, { requests, profileId }): RequestsState => {
      return {
        ...state,
        requests: requestsAdapter.upsertMany(requests, state.requests),
        profileLoaded: [...state.profileLoaded, profileId],
      };
    }
  ),
  on(
    RequestsActions.createRequestSuccess,
    (state, { request }): RequestsState => {
      return {
        ...state,
        requests: requestsAdapter.upsertOne(request, state.requests),
      };
    }
  ),
  on(
    RequestsActions.updateRequestSuccess,
    (state, { request }): RequestsState => {
      return {
        ...state,
        requests: requestsAdapter.upsertOne(request, state.requests),
      };
    }
  ),
  on(
    RequestsActions.deleteRequestSuccess,
    (state, { deletedId }): RequestsState => {
      return {
        ...state,
        requests: requestsAdapter.removeOne(deletedId, state.requests),
      };
    }
  ),
  on(
    RequestsActions.uploadImagesSuccess,
    (state, { request }): RequestsState => {
      return {
        ...state,
        requests: requestsAdapter.upsertOne(request, state.requests),
      };
    }
  ),
  on(
    RequestsActions.deleteImageSuccess,
    (state, { request }): RequestsState => {
      return {
        ...state,
        requests: requestsAdapter.upsertOne(request, state.requests),
      };
    }
  )
);
