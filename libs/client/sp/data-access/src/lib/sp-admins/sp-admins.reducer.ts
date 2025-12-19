import { ServeAdmin, SpAdminQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as SpAdminsActions from './sp-admins.actions';

export const SP_ADMINS_KEY = 'spAdmins';

export type SpAdminStoreModel = IParser<ServeAdmin, typeof SpAdminQuery>;

export interface SpAdminsState {
  spAdmins: EntityState<SpAdminStoreModel>;
  profilesLoaded: string[];
}

export const spAdminsAdapter = createEntityAdapter<SpAdminStoreModel>();

const initialState: SpAdminsState = {
  spAdmins: spAdminsAdapter.getInitialState(),
  profilesLoaded: [],
};

export const SpAdminsReducer = createReducer(
  initialState,
  on(
    SpAdminsActions.refreshSpAdmins,
    (state, { spId }): SpAdminsState => {
      return {
        ...state,
        profilesLoaded: state.profilesLoaded.filter((p) => p !== spId),
      };
    }
  ),
  on(
    SpAdminsActions.loadSpAdminsSuccess,
    (state, { spAdmins, spId }): SpAdminsState => {
      return {
        ...state,
        spAdmins: spAdminsAdapter.upsertMany(spAdmins, state.spAdmins),
        profilesLoaded: [...state.profilesLoaded, spId],
      };
    }
  ),
  on(
    SpAdminsActions.addSpAdminSuccess,
    (state, { spAdmin }): SpAdminsState => {
      return {
        ...state,
        spAdmins: spAdminsAdapter.upsertOne(spAdmin, state.spAdmins),
      };
    }
  ),
  on(
    SpAdminsActions.removeSpAdminSuccess,
    (state, { deletedId }): SpAdminsState => {
      return {
        ...state,
        spAdmins: spAdminsAdapter.removeOne(deletedId, state.spAdmins),
      };
    }
  )
);
