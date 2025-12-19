import { EpAdminQuery, ExchangeAdmin, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as EpAdminsActions from './ep-admins.actions';

export const EP_ADMINS_KEY = 'epAdmins';

export type EpAdminStoreModel = IParser<ExchangeAdmin, typeof EpAdminQuery>;

export interface EpAdminsState {
  epAdmins: EntityState<EpAdminStoreModel>;
  profilesLoaded: string[];
}

export const epAdminsAdapter = createEntityAdapter<EpAdminStoreModel>();

const initialState: EpAdminsState = {
  epAdmins: epAdminsAdapter.getInitialState(),
  profilesLoaded: [],
};

export const EpAdminsReducer = createReducer(
  initialState,
  on(
    EpAdminsActions.refreshEpAdmins,
    (state, { epId }): EpAdminsState => {
      return {
        ...state,
        profilesLoaded: state.profilesLoaded.filter((p) => p !== epId),
      };
    }
  ),
  on(
    EpAdminsActions.loadEpAdminsSuccess,
    (state, { epAdmins, epId }): EpAdminsState => {
      return {
        ...state,
        epAdmins: epAdminsAdapter.upsertMany(epAdmins, state.epAdmins),
        profilesLoaded: [...state.profilesLoaded, epId],
      };
    }
  ),
  on(
    EpAdminsActions.addEpAdminSuccess,
    (state, { epAdmin }): EpAdminsState => {
      return {
        ...state,
        epAdmins: epAdminsAdapter.upsertOne(epAdmin, state.epAdmins),
      };
    }
  ),
  on(
    EpAdminsActions.removeEpAdminSuccess,
    (state, { deletedId }): EpAdminsState => {
      return {
        ...state,
        epAdmins: epAdminsAdapter.removeOne(deletedId, state.epAdmins),
      };
    }
  )
);
