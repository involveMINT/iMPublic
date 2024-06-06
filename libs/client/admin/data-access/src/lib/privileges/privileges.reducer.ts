import { User, UserPrivilegeQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PrivilegesActions from './privileges.actions';

export const PRIVILEGES_FEATURE_KEY = 'adminPrivileges';

export type BaPrivilegeStoreModel = IParser<User, typeof UserPrivilegeQuery>;

export interface State {
  baPrivileges: EntityState<BaPrivilegeStoreModel>;
  loaded: boolean; // has the Privileges list been loaded
}

export const baPrivilegesAdapter = createEntityAdapter<BaPrivilegeStoreModel>();

export const initialState: State = {
  baPrivileges: baPrivilegesAdapter.getInitialState(),
  loaded: false,
};

export const PrivilegesReducer = createReducer(
  initialState,
  on(
    PrivilegesActions.refreshPrivileges,
    (state): State => ({
      ...state,
      baPrivileges: baPrivilegesAdapter.removeAll(state.baPrivileges),
      loaded: false,
    })
  ),
  on(
    PrivilegesActions.loadPrivilegesSuccess,
    (state, { baPrivileges }): State => ({
      ...state,
      baPrivileges: baPrivilegesAdapter.setAll(baPrivileges, state.baPrivileges),
      loaded: true,
    })
  ),
  on(
    PrivilegesActions.grantBAPrivilegeSuccess,
    (state, { user }): State => ({
      ...state,
      baPrivileges: baPrivilegesAdapter.upsertOne(user, state.baPrivileges),
    })
  ),
  on(
    PrivilegesActions.revokeBAPrivilegeSuccess,
    (state, { user }): State => ({
      ...state,
      baPrivileges: baPrivilegesAdapter.removeOne(user.id, state.baPrivileges),
    })
  )
);
