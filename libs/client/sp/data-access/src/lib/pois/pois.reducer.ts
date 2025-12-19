import { Poi, PoiSpQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PoisActions from './pois.actions';

export const SR_POIS_KEY = 'sr_pois';

export type PoiSpStoreModel = IParser<Poi, typeof PoiSpQuery>;

export interface PoisState {
  pois: EntityState<PoiSpStoreModel>;
  projectsLoaded: string[];
}

export const poisAdapter = createEntityAdapter<PoiSpStoreModel>();

const initialState: PoisState = {
  pois: poisAdapter.getInitialState(),
  projectsLoaded: [],
};

export const PoiReducer = createReducer(
  initialState,
  on(
    PoisActions.refreshPois,
    (state): PoisState => {
      return {
        ...state,
        projectsLoaded: [],
      };
    }
  ),
  on(
    PoisActions.loadPoisByProjectSuccess,
    (state, { pois, projectId }): PoisState => {
      return {
        pois: poisAdapter.upsertMany(pois, state.pois),
        projectsLoaded: [...state.projectsLoaded, projectId],
      };
    }
  ),
  on(
    PoisActions.approvePoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  )
);
