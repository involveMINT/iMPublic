import { createAction, props } from '@ngrx/store';
import { SpAdminStoreModel } from './sp-admins.reducer';
import { APIOperationError } from '@involvemint/shared/domain';

export const refreshSpAdmins = createAction(
  '[ServePartner|Admins] Refresh Sp Admins',
  props<{ spId: string }>()
);
export const loadSpAdmins = createAction('[ServePartner|Admins] Load Sp Admins');

export const loadSpAdminsSuccess = createAction(
  '[ServePartner|Admins] Load Sp Admins Success',
  props<{ spAdmins: SpAdminStoreModel[]; spId: string }>()
);

export const loadSpAdminsError = createAction(
  '[ServePartner|Admins] Load Sp Admins Error',
  props<{ error: APIOperationError }>()
);

/*
      _      _    _ 
     /_\  __| |__| |
    / _ \/ _` / _` |
   /_/ \_\__,_\__,_|
                    
*/
export const addSpAdmin = createAction('[ServePartner|Admins] Add Sp Admin', props<{ userId: string }>());

export const addSpAdminSuccess = createAction(
  '[ServePartner|Admins] Add Sp Admin Success',
  props<{ spAdmin: SpAdminStoreModel }>()
);

export const addSpAdminError = createAction(
  '[ServePartner|Admins] Add Sp Admin Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                       
   | _ \___ _ __  _____ _____ 
   |   / -_) '  \/ _ \ V / -_)
   |_|_\___|_|_|_\___/\_/\___|
                              
*/
export const removeSpAdmin = createAction(
  '[ServePartner|Admins] Remove Sp Admin',
  props<{ spAdmin: SpAdminStoreModel }>()
);

export const removeSpAdminSuccess = createAction(
  '[ServePartner|Admins] Remove Sp Admin Success',
  props<{ deletedId: string }>()
);

export const removeSpAdminError = createAction(
  '[ServePartner|Admins] Remove Sp Admin Error',
  props<{ error: APIOperationError }>()
);
