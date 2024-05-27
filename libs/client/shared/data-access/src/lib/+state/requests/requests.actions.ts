import { DeleteRequestImageDto, APIOperationError, UpdateRequestDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { RequestStoreModel } from './requests.reducer';

export const refreshRequestsForProfile = createAction(
  '[Requests] Requests Refresh For Profile',
  props<{ profile: ActiveProfile }>()
);
export const loadRequestsForProfile = createAction(
  '[Requests] Requests Load For Profile',
  props<{ profile: ActiveProfile }>()
);

export const loadRequestsForProfileSuccess = createAction(
  '[Requests] Requests Load For Profile Success',
  props<{ requests: RequestStoreModel[]; profileId: string }>()
);

export const loadRequestsForProfileError = createAction(
  '[Requests] Requests Load For Profile Error',
  props<{ error: APIOperationError }>()
);

/*
     ___              _       
    / __|_ _ ___ __ _| |_ ___ 
   | (__| '_/ -_) _` |  _/ -_)
    \___|_| \___\__,_|\__\___|
                              
*/
export const createRequest = createAction(
  '[Requests] Create Request',
  props<{ returnToEpStorefront: boolean }>()
);

export const createRequestSuccess = createAction(
  '[Requests] Create Request Success',
  props<{ request: RequestStoreModel }>()
);

export const createRequestError = createAction(
  '[Requests] Create Request Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _          _      _       
   | | | |_ __  __| |__ _| |_ ___ 
   | |_| | '_ \/ _` / _` |  _/ -_)
    \___/| .__/\__,_\__,_|\__\___|
         |_|                      
*/
export const updateRequest = createAction('[Requests] Update Request', props<{ dto: UpdateRequestDto }>());

export const updateRequestSuccess = createAction(
  '[Requests] Update Request Success',
  props<{ request: RequestStoreModel }>()
);

export const updateRequestError = createAction(
  '[Requests] Update Request Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _       
   |   \ ___| |___| |_ ___ 
   | |) / -_) / -_)  _/ -_)
   |___/\___|_\___|\__\___|
                           
*/

export const deleteRequest = createAction(
  '[Requests] Delete Request',
  props<{ request: RequestStoreModel; returnToEpStorefront: boolean }>()
);

export const deleteRequestSuccess = createAction(
  '[Requests] Delete Request Success',
  props<{ deletedId: string }>()
);

export const deleteRequestError = createAction(
  '[Requests] Delete Request Error',
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
  '[Requests] Upload Request Images',
  props<{ request: RequestStoreModel; images: File[] }>()
);

export const uploadImagesSuccess = createAction(
  '[Requests] Upload Request Images Success',
  props<{ request: RequestStoreModel }>()
);

export const uploadImagesError = createAction(
  '[Requests] Upload Request Images Error',
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
  '[Requests] Delete Request Image',
  props<{ dto: DeleteRequestImageDto }>()
);

export const deleteImageSuccess = createAction(
  '[Requests] Delete Request Image Success',
  props<{ request: RequestStoreModel }>()
);

export const deleteImageError = createAction(
  '[Requests] Delete Request Image Error',
  props<{ error: APIOperationError }>()
);
