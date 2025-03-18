import { createAction, props } from '@ngrx/store';
import { EpAdminStoreModel } from './ep-admins.reducer';
import { APIOperationError } from '@involvemint/shared/domain';

export const refreshEpAdmins = createAction(
  '[ExchangePartner|Admins] Refresh Ep Admins',
  props<{ epId: string }>()
);
export const loadEpAdmins = createAction('[ExchangePartner|Admins] Load Ep Admins');

export const loadEpAdminsSuccess = createAction(
  '[ExchangePartner|Admins] Load Ep Admins Success',
  props<{ epAdmins: EpAdminStoreModel[]; epId: string }>()
);

export const loadEpAdminsError = createAction(
  '[ExchangePartner|Admins] Load Ep Admins Error',
  props<{ error: APIOperationError }>()
);

/*
      _      _    _ 
     /_\  __| |__| |
    / _ \/ _` / _` |
   /_/ \_\__,_\__,_|
                    
*/
export const addEpAdmin = createAction('[ExchangePartner|Admins] Add Ep Admin', props<{ userId: string }>());

export const addEpAdminSuccess = createAction(
  '[ExchangePartner|Admins] Add Ep Admin Success',
  props<{ epAdmin: EpAdminStoreModel }>()
);

export const addEpAdminError = createAction(
  '[ExchangePartner|Admins] Add Ep Admin Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                       
   | _ \___ _ __  _____ _____ 
   |   / -_) '  \/ _ \ V / -_)
   |_|_\___|_|_|_\___/\_/\___|
                              
*/
export const removeEpAdmin = createAction(
  '[ExchangePartner|Admins] Remove Ep Admin',
  props<{ epAdmin: EpAdminStoreModel }>()
);

export const removeEpAdminSuccess = createAction(
  '[ExchangePartner|Admins] Remove Ep Admin Success',
  props<{ deletedId: string }>()
);

export const removeEpAdminError = createAction(
  '[ExchangePartner|Admins] Remove Ep Admin Error',
  props<{ error: APIOperationError }>()
);
