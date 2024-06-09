import { APIOperationError, UpdateProjectDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { ProjectSpStoreModel } from './projects.reducer';

export const refreshProjects = createAction(
  '[ServePartner|Projects] Refresh Projects',
  props<{ spId: string }>()
);

export const loadProjects = createAction('[ServePartner|Projects] Load Projects');

export const loadProjectsSuccess = createAction(
  '[ServePartner|Projects] Load Projects Success',
  props<{ projects: ProjectSpStoreModel[]; spId: string }>()
);

export const loadProjectsError = createAction(
  '[ServePartner|Projects] Load Projects Error',
  props<{ error: APIOperationError }>()
);

/*
     ___              _         ___        _ _   _
    / __|_ _ ___ __ _| |_ ___  | _ \___ __(_) |_(_)___ _ _
   | (__| '_/ -_) _` |  _/ -_) |  _/ _ (_-< |  _| / _ \ ' \
    \___|_| \___\__,_|\__\___| |_| \___/__/_|\__|_\___/_||_|

*/
export const createProject = createAction('[ServePartner|Projects] Create Project');

export const createProjectSuccess = createAction(
  '[ServePartner|Projects] Create Project Success',
  props<{ project: ProjectSpStoreModel }>()
);

export const createProjectError = createAction(
  '[ServePartner|Projects] Create Project Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _          _      _         ___        _ _   _
   | | | |_ __  __| |__ _| |_ ___  | _ \___ __(_) |_(_)___ _ _
   | |_| | '_ \/ _` / _` |  _/ -_) |  _/ _ (_-< |  _| / _ \ ' \
    \___/| .__/\__,_\__,_|\__\___| |_| \___/__/_|\__|_\___/_||_|
         |_|
*/

export const updateProject = createAction(
  '[ServePartner|Projects] Update Project',
  props<{ dto: UpdateProjectDto }>()
);

export const updateProjectSuccess = createAction(
  '[ServePartner|Projects] Update Project Success',
  props<{ project: ProjectSpStoreModel }>()
);

export const updateProjectError = createAction(
  '[ServePartner|Projects] Update Project Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _         ___        _ _   _          
   |   \ ___| |___| |_ ___  | _ \___ __(_) |_(_)___ _ _  
   | |) / -_) / -_)  _/ -_) |  _/ _ (_-< |  _| / _ \ ' \ 
   |___/\___|_\___|\__\___| |_| \___/__/_|\__|_\___/_||_|
                                                         
*/

export const deleteProject = createAction(
  '[ServePartner|Projects] Delete Project',
  props<{ project: ProjectSpStoreModel }>()
);

export const deleteProjectSuccess = createAction(
  '[ServePartner|Projects] Delete Project Success',
  props<{ deletedId: string }>()
);

export const deleteProjectError = createAction(
  '[ServePartner|Projects] Delete Project Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _      _              _   ___                        
   | | | |_ __| |___  __ _ __| | |_ _|_ __  __ _ __ _ ___ ___
   | |_| | '_ \ / _ \/ _` / _` |  | || '  \/ _` / _` / -_|_-<
    \___/| .__/_\___/\__,_\__,_| |___|_|_|_\__,_\__, \___/__/
         |_|                                    |___/        
*/

export const uploadImages = createAction(
  '[ServePartner|Projects] Upload Project Images',
  props<{ project: ProjectSpStoreModel; images: File[] }>()
);

export const uploadImagesSuccess = createAction(
  '[ServePartner|Projects] Upload Project Images Success',
  props<{ project: ProjectSpStoreModel }>()
);

export const uploadImagesError = createAction(
  '[ServePartner|Projects] Upload Project Images Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _         ___                     
   |   \ ___| |___| |_ ___  |_ _|_ __  __ _ __ _ ___ 
   | |) / -_) / -_)  _/ -_)  | || '  \/ _` / _` / -_)
   |___/\___|_\___|\__\___| |___|_|_|_\__,_\__, \___|
                                           |___/     
*/

export const deleteImage = createAction(
  '[ServePartner|Projects] Delete Project Images',
  props<{ project: ProjectSpStoreModel; index: number }>()
);

export const deleteImageSuccess = createAction(
  '[ServePartner|Projects] Delete Project Images Success',
  props<{ project: ProjectSpStoreModel }>()
);

export const deleteImageError = createAction(
  '[ServePartner|Projects] Delete Project Images Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _      _              _    ___        _              __      __    _             
   | | | |_ __| |___  __ _ __| |  / __|  _ __| |_ ___ _ __   \ \    / /_ _(_)_ _____ _ _ 
   | |_| | '_ \ / _ \/ _` / _` | | (_| || (_-<  _/ _ \ '  \   \ \/\/ / _` | \ V / -_) '_|
    \___/| .__/_\___/\__,_\__,_|  \___\_,_/__/\__\___/_|_|_|   \_/\_/\__,_|_|\_/\___|_|  
         |_|                                                                             
*/
export const uploadCustomWaiver = createAction(
  '[ServePartner|Projects] Upload Custom Waiver',
  props<{ project: ProjectSpStoreModel; file: File }>()
);

export const uploadCustomWaiverSuccess = createAction(
  '[ServePartner|Projects] Upload Custom WaiverSuccess',
  props<{ project: ProjectSpStoreModel }>()
);

export const uploadCustomWaiverError = createAction(
  '[ServePartner|Projects] Upload Custom WaiverError',
  props<{ error: APIOperationError }>()
);
