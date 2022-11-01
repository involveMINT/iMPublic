import { createFeatureSelector, createSelector } from '@ngrx/store';
import { poisAdapter, PoisState, POIS_KEY } from './pois.reducer';

const { selectAll, selectEntities } = poisAdapter.getSelectors();

const getPoisState = createFeatureSelector<PoisState>(POIS_KEY);

export const getPois = createSelector(getPoisState, (state: PoisState) => ({
  pois: selectAll(state.pois),
  pagesLoaded: state.pagesLoaded,
  loaded: state.pagesLoaded > 0,
}));

export const getPoi = (id: string) =>
  createSelector(getPoisState, (state: PoisState) => ({
    poi: selectEntities(state.pois)[id],
    pagesLoaded: state.pagesLoaded,
    loaded: state.pagesLoaded > 0,
  }));
