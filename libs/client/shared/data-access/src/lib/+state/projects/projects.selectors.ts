import { createFeatureSelector, createSelector } from '@ngrx/store';
import { projectsAdapter, ProjectsState, PROJECTS_KEY } from './projects.reducer';

const { selectAll, selectEntities } = projectsAdapter.getSelectors();

const getProjectsState = createFeatureSelector<ProjectsState>(PROJECTS_KEY);

export const getProjects = createSelector(getProjectsState, (state: ProjectsState) => ({
  projects: selectAll(state.projects),
  loaded: state.pagesLoaded > 0,
  pagesLoaded: state.pagesLoaded,
}));

export const getProject = (id: string) =>
  createSelector(getProjectsState, (state: ProjectsState) => ({
    project: selectEntities(state.projects)[id],
    loaded: state.pagesLoaded > 0,
    pagesLoaded: state.pagesLoaded,
  }));
