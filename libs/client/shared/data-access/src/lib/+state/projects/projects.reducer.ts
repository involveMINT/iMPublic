import { Project, ProjectFeedQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ProjectActions from './projects.actions';

export const PROJECTS_KEY = 'projects';

export type ProjectFeedStoreModel = IParser<Project, typeof ProjectFeedQuery>;

export interface ProjectsState {
  projects: EntityState<ProjectFeedStoreModel>;
  pagesLoaded: number;
}

export const projectsAdapter = createEntityAdapter<ProjectFeedStoreModel>();

const initialState: ProjectsState = {
  projects: projectsAdapter.getInitialState(),
  pagesLoaded: 0,
};

export const ProjectsReducer = createReducer(
  initialState,
  on(
    ProjectActions.refreshProjects,
    (state): ProjectsState => {
      return {
        ...state,
        projects: projectsAdapter.removeAll(state.projects),
        pagesLoaded: 0,
      };
    }
  ),
  on(
    ProjectActions.projectsLoadSuccess,
    (state, { items, page }): ProjectsState => {
      return {
        ...state,
        projects: projectsAdapter.upsertMany(items, state.projects),
        pagesLoaded: page,
      };
    }
  ),
  on(
    ProjectActions.getProjectSuccess,
    (state, { project }): ProjectsState => {
      return {
        ...state,
        projects: projectsAdapter.upsertOne(project, state.projects),
      };
    }
  )
);
