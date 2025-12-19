import { APIOperationError, GetProjectDto as ProjectActions } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { ProjectFeedStoreModel } from './projects.reducer';

export const projectsLoad = createAction('[Projects] Projects Load', props<{ page: number }>());
export const refreshProjects = createAction('[Projects] Projects Refresh');

export const projectsLoadSuccess = createAction(
  '[Projects] Projects Load Success',
  props<{ items: ProjectFeedStoreModel[]; page: number }>()
);

export const projectsLoadError = createAction(
  '[Projects] Projects Load Error',
  props<{ error: APIOperationError }>()
);

/*
     ___     _     ___        _ _   _          
    / __|___| |_  | _ \___ __(_) |_(_)___ _ _  
   | (_ / -_)  _| |  _/ _ (_-< |  _| / _ \ ' \ 
    \___\___|\__| |_| \___/__/_|\__|_\___/_||_|
                                               
*/

export const getProject = createAction('[Projects] Get Project', props<ProjectActions>());

export const getProjectSuccess = createAction(
  '[Projects] Get Project Success',
  props<{ project: ProjectFeedStoreModel }>()
);

export const getProjectError = createAction(
  '[Projects] Get Project Error',
  props<{ error: APIOperationError }>()
);
