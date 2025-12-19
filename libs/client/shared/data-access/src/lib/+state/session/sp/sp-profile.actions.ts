import { DeleteSpImageDto, EditSpProfileDto, APIOperationError } from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { createAction, props } from '@ngrx/store';
import { UserStoreModel } from '../user-session.reducer';

/*
    ___    _ _ _     ___ ___   ___          __ _ _     
   | __|__| (_) |_  / __| _ \ | _ \_ _ ___ / _(_) |___ 
   | _|/ _` | |  _| \__ \  _/ |  _/ '_/ _ \  _| | / -_)
   |___\__,_|_|\__| |___/_|   |_| |_| \___/_| |_|_\___|
                                                                                                          
*/
export const editSpProfile = createAction(
  '[UserSession] Edit SP Profile',
  props<{ changes: EditSpProfileDto['changes'] }>()
);

export const editSpProfileSuccess = createAction(
  '[UserSession] Edit SP Profile Success',
  props<{ servePartner: UnArray<UserStoreModel['serveAdmins']>['servePartner'] }>()
);

export const editSpProfileError = createAction(
  '[UserSession] Edit SP Profile Error',
  props<{ error: APIOperationError }>()
);

/*
     ___ _                         ___ ___   _                    ___ _ _     
    / __| |_  __ _ _ _  __ _ ___  / __| _ \ | |   ___  __ _ ___  | __(_) |___ 
   | (__| ' \/ _` | ' \/ _` / -_) \__ \  _/ | |__/ _ \/ _` / _ \ | _|| | / -_)
    \___|_||_\__,_|_||_\__, \___| |___/_|   |____\___/\__, \___/ |_| |_|_\___|
                       |___/                          |___/                                  
*/
export const changeSpLogoFile = createAction('[UserSession] Change SP Logo File', props<{ file: File }>());

export const changeSpLogoFileSuccess = createAction(
  '[UserSession] Change SP Logo File Success',
  props<{ servePartner: UnArray<UserStoreModel['serveAdmins']>['servePartner'] }>()
);

export const changeSpLogoFileError = createAction(
  '[UserSession] Change SP Logo File Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _      _              _   ___        ___                        
   | | | |_ __| |___  __ _ __| | / __|_ __  |_ _|_ __  __ _ __ _ ___ ___
   | |_| | '_ \ / _ \/ _` / _` | \__ \ '_ \  | || '  \/ _` / _` / -_|_-<
    \___/| .__/_\___/\__,_\__,_| |___/ .__/ |___|_|_|_\__,_\__, \___/__/
         |_|                         |_|                   |___/        
*/
export const uploadSpImages = createAction('[UserSession] Upload SP Images', props<{ files: File[] }>());

export const uploadSpImagesSuccess = createAction(
  '[UserSession] Upload SP Images Success',
  props<{ servePartner: UnArray<UserStoreModel['serveAdmins']>['servePartner'] }>()
);

export const uploadSpImagesError = createAction(
  '[UserSession] Upload SP Images Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _         ___        ___                     
   |   \ ___| |___| |_ ___  / __|_ __  |_ _|_ __  __ _ __ _ ___ 
   | |) / -_) / -_)  _/ -_) \__ \ '_ \  | || '  \/ _` / _` / -_)
   |___/\___|_\___|\__\___| |___/ .__/ |___|_|_|_\__,_\__, \___|
                                |_|                   |___/     
*/

export const deleteSpImage = createAction(
  '[UserSession] Delete SP Image',
  props<{ imagesFilePathsIndex: DeleteSpImageDto['imagesFilePathsIndex'] }>()
);

export const deleteSpImageSuccess = createAction(
  '[UserSession] Delete SP Image Success',
  props<{ servePartner: UnArray<UserStoreModel['serveAdmins']>['servePartner'] }>()
);

export const deleteSpImageError = createAction(
  '[UserSession] Delete SP Image Error',
  props<{ error: APIOperationError }>()
);
