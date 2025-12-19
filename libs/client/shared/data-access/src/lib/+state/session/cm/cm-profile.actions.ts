import { EditCmProfileDto, APIOperationError } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { UserStoreModel } from '../user-session.reducer';

/*
    ___    _ _ _      ___ __  __   ___          __ _ _
   | __|__| (_) |_   / __|  \/  | | _ \_ _ ___ / _(_) |___
   | _|/ _` | |  _| | (__| |\/| | |  _/ '_/ _ \  _| | / -_)
   |___\__,_|_|\__|  \___|_|  |_| |_| |_| \___/_| |_|_\___|

*/
export const editCmProfile = createAction(
  '[UserSession] Edit CM Profile',
  props<{ dto: EditCmProfileDto }>()
);

export const editCmProfileSuccess = createAction(
  '[UserSession] Edit CM Profile Success',
  props<{ changeMaker: UserStoreModel['changeMaker'] }>()
);

export const editCmProfileError = createAction(
  '[UserSession] Edit CM Profile Error',
  props<{ error: APIOperationError }>()
);

/*
     ___ _                          ___ __  __   ___          __ _ _       ___ _
    / __| |_  __ _ _ _  __ _ ___   / __|  \/  | | _ \_ _ ___ / _(_) |___  | _ (_)__
   | (__| ' \/ _` | ' \/ _` / -_) | (__| |\/| | |  _/ '_/ _ \  _| | / -_) |  _/ / _|
    \___|_||_\__,_|_||_\__, \___|  \___|_|  |_| |_| |_| \___/_| |_|_\___| |_| |_\__|
                       |___/
*/
export const changeCmProfilePic = createAction(
  '[UserSession] Change CM Profile Pic',
  props<{ file: File }>()
);

export const changeCmProfilePicSuccess = createAction(
  '[UserSession] Change CM Profile Pic Success',
  props<{ changeMaker: UserStoreModel['changeMaker'] }>()
);

export const changeCmProfilePicError = createAction(
  '[UserSession] Change CM Profile Pic Error',
  props<{ error: APIOperationError }>()
);
