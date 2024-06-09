import { Poi, PoiCmQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as PoisActions from './pois.actions';

export const POIS_KEY = 'pois';

export type PoiCmStoreModel = IParser<Poi, typeof PoiCmQuery>;

export interface PoisState {
  pois: EntityState<PoiCmStoreModel>;
  pagesLoaded: number;
}

export const poisAdapter = createEntityAdapter<PoiCmStoreModel>();

const initialState: PoisState = {
  pois: poisAdapter.getInitialState(),
  pagesLoaded: 0,
};

export const PoiReducer = createReducer(
  initialState,
  on(
    PoisActions.refreshPois,
    (state): PoisState => {
      return {
        ...state,
        pagesLoaded: 0,
      };
    }
  ),
  on(
    PoisActions.loadPoisSuccess,
    (state, { pois, page }): PoisState => {
      return {
        pois: poisAdapter.upsertMany(pois, state.pois),
        pagesLoaded: page,
      };
    }
  ),
  on(
    PoisActions.createPoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  ),
  on(
    PoisActions.startPoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  ),
  on(
    PoisActions.withdrawPoiSuccess,
    (state, { deletedId }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.removeOne(deletedId, state.pois),
      };
    }
  ),
  on(
    PoisActions.pausePoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  ),
  on(
    PoisActions.resumePoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  ),
  on(
    PoisActions.stopPoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  ),
  on(
    PoisActions.submitPoiSuccess,
    (state, { poi }): PoisState => {
      return {
        ...state,
        pois: poisAdapter.upsertOne(poi, state.pois),
      };
    }
  )
);
