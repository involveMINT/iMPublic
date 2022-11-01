import { createFeatureSelector, createSelector } from '@ngrx/store';
import { poisAdapter, PoisState, SR_POIS_KEY } from './pois.reducer';

const { selectAll, selectEntities } = poisAdapter.getSelectors();

const getPoisState = createFeatureSelector<PoisState>(SR_POIS_KEY);

export const getPois = createSelector(getPoisState, (state: PoisState) => ({
  pois: selectAll(state.pois),
  projectsLoaded: state.projectsLoaded,
}));

export const getPoi = (id: string) =>
  createSelector(getPoisState, (state: PoisState) => ({
    poi: selectEntities(state.pois)[id],
    projectsLoaded: state.projectsLoaded,
  }));

export const getPoisByProject = (projectId: string) =>
  createSelector(getPoisState, (state: PoisState) => ({
    pois: selectAll(state.pois).filter((p) => p.enrollment.project.id === projectId),
    projectsLoaded: state.projectsLoaded,
  }));
