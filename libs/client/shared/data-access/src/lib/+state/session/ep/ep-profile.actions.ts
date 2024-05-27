import { DeleteEpImageDto, EditEpProfileDto, APIOperationError } from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { createAction, props } from '@ngrx/store';
import { UserStoreModel } from '../user-session.reducer';

/*
  ___    _ _ _     ___ ___   ___          __ _ _     
 | __|__| (_) |_  | __| _ \ | _ \_ _ ___ / _(_) |___ 
 | _|/ _` | |  _| | _||  _/ |  _/ '_/ _ \  _| | / -_)
 |___\__,_|_|\__| |___|_|   |_| |_| \___/_| |_|_\___|
                                                     
*/
export const editEpProfile = createAction(
  '[UserSession] Edit EP Profile',
  props<{ changes: EditEpProfileDto['changes'] }>()
);

export const editEpProfileSuccess = createAction(
  '[UserSession] Edit EP Profile Success',
  props<{ exchangePartner: UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner'] }>()
);

export const editEpProfileError = createAction(
  '[UserSession] Edit EP Profile Error',
  props<{ error: APIOperationError }>()
);

/*
   ___ _                         ___ ___   _                    ___ _ _     
  / __| |_  __ _ _ _  __ _ ___  | __| _ \ | |   ___  __ _ ___  | __(_) |___ 
 | (__| ' \/ _` | ' \/ _` / -_) | _||  _/ | |__/ _ \/ _` / _ \ | _|| | / -_)
  \___|_||_\__,_|_||_\__, \___| |___|_|   |____\___/\__, \___/ |_| |_|_\___|
                     |___/                          |___/                   
                     
*/
export const changeEpLogoFile = createAction('[UserSession] Change EP Logo File', props<{ file: File }>());

export const changeEpLogoFileSuccess = createAction(
  '[UserSession] Change EP Logo File Success',
  props<{ exchangePartner: UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner'] }>()
);

export const changeEpLogoFileError = createAction(
  '[UserSession] Change EP Logo File Error',
  props<{ error: APIOperationError }>()
);

/*
  _   _      _              _   ___ ___   ___                        
 | | | |_ __| |___  __ _ __| | | __| _ \ |_ _|_ __  __ _ __ _ ___ ___
 | |_| | '_ \ / _ \/ _` / _` | | _||  _/  | || '  \/ _` / _` / -_|_-<
  \___/| .__/_\___/\__,_\__,_| |___|_|   |___|_|_|_\__,_\__, \___/__/
       |_|                                              |___/        
       
*/
export const uploadEpImages = createAction('[UserSession] Upload EP Images', props<{ files: File[] }>());

export const uploadEpImagesSuccess = createAction(
  '[UserSession] Upload EP Images Success',
  props<{ exchangePartner: UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner'] }>()
);

export const uploadEpImagesError = createAction(
  '[UserSession] Upload EP Images Error',
  props<{ error: APIOperationError }>()
);

/*
  ___      _     _         ___ ___   ___                     
 |   \ ___| |___| |_ ___  | __| _ \ |_ _|_ __  __ _ __ _ ___ 
 | |) / -_) / -_)  _/ -_) | _||  _/  | || '  \/ _` / _` / -_)
 |___/\___|_\___|\__\___| |___|_|   |___|_|_|_\__,_\__, \___|
                                                   |___/         

*/

export const deleteEpImage = createAction(
  '[UserSession] Delete EP Image',
  props<{ imagesFilePathsIndex: DeleteEpImageDto['imagesFilePathsIndex'] }>()
);

export const deleteEpImageSuccess = createAction(
  '[UserSession] Delete EP Image Success',
  props<{ exchangePartner: UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner'] }>()
);

export const deleteEpImageError = createAction(
  '[UserSession] Delete EP Image Error',
  props<{ error: APIOperationError }>()
);
