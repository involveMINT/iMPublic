import { Project, ProjectSpQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as ProjectsSpActions from './projects.actions';

export const PROJECTS_SP_FEATURE_KEY = 'projectsSp';

export type ProjectSpStoreModel = IParser<Project, typeof ProjectSpQuery>;

export interface State {
  projects: EntityState<ProjectSpStoreModel>;
  spAccountsLoaded: string[];
}

export const projectsAdapter = createEntityAdapter<ProjectSpStoreModel>();

export const initialState: State = {
  projects: projectsAdapter.getInitialState(),
  spAccountsLoaded: [],
};

export const ProjectsReducer = createReducer(
  initialState,
  on(
    ProjectsSpActions.refreshProjects,
    (state, { spId }): State => ({
      ...state,
      spAccountsLoaded: state.spAccountsLoaded.filter((sp) => sp !== spId),
    })
  ),
  on(
    ProjectsSpActions.loadProjectsSuccess,
    (state, { projects, spId }): State => ({
      ...state,
      projects: projectsAdapter.upsertMany(projects, state.projects),
      spAccountsLoaded: [...state.spAccountsLoaded, spId],
    })
  ),
  on(
    ProjectsSpActions.createProjectSuccess,
    (state, { project }): State => ({
      ...state,
      projects: projectsAdapter.upsertOne(project, state.projects),
    })
  ),
  on(
    ProjectsSpActions.updateProjectSuccess,
    (state, { project }): State => ({
      ...state,
      projects: projectsAdapter.upsertOne(project, state.projects),
    })
  ),
  on(
    ProjectsSpActions.uploadImagesSuccess,
    (state, { project }): State => ({
      ...state,
      projects: projectsAdapter.upsertOne(project, state.projects),
    })
  ),
  on(
    ProjectsSpActions.deleteImageSuccess,
    (state, { project }): State => ({
      ...state,
      projects: projectsAdapter.upsertOne(project, state.projects),
    })
  ),
  on(
    ProjectsSpActions.deleteProjectSuccess,
    (state, { deletedId }): State => ({
      ...state,
      projects: projectsAdapter.removeOne(deletedId, state.projects),
    })
  ),
  on(
    ProjectsSpActions.uploadCustomWaiver,
    (state, { project }): State => ({
      ...state,
      projects: projectsAdapter.upsertOne(project, state.projects),
    })
  )
);
