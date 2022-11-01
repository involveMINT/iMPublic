import { createFeatureSelector, createSelector } from '@ngrx/store';
import { projectsAdapter, PROJECTS_SP_FEATURE_KEY, State } from './projects.reducer';

const getProjectsState = createFeatureSelector<State>(PROJECTS_SP_FEATURE_KEY);

const { selectAll, selectEntities } = projectsAdapter.getSelectors();

export const getProjects = createSelector(getProjectsState, (state: State) => ({
  projects: selectAll(state.projects),
  spAccountsLoaded: state.spAccountsLoaded,
}));

export const getProject = (projectId: string) =>
  createSelector(getProjectsState, (state: State) => ({
    project: selectEntities(state.projects)[projectId],
    spAccountsLoaded: state.spAccountsLoaded,
  }));
