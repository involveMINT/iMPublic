import { createAction, props } from '@ngrx/store';
import { PassportDocumentStoreModel } from './passport.reducer';
import { APIOperationError } from '@involvemint/shared/domain';

export const refreshPassport = createAction('[Passport|ChangeMaker] Refresh Passport');
export const loadPassport = createAction('[Passport|ChangeMaker] Load Passport');

export const loadPassportSuccess = createAction(
  '[Passport|ChangeMaker] Load Passport Success',
  props<{ documents: PassportDocumentStoreModel[] }>()
);

export const loadPassportError = createAction(
  '[Passport|ChangeMaker] Load Passport Error',
  props<{ error: APIOperationError }>()
);

/*
    _  _            
   | \| |_____ __ __
   | .` / -_) V  V /
   |_|\_\___|\_/\_/ 
                    
*/

export const createPassportDocument = createAction(
  '[Passport|ChangeMaker] Create Passport',
  props<{ file: File }>()
);

export const createPassportDocumentSuccess = createAction(
  '[Passport|ChangeMaker] Create Passport Success',
  props<{ document: PassportDocumentStoreModel }>()
);

export const createPassportDocumentError = createAction(
  '[Passport|ChangeMaker] Create Passport Error',
  props<{ error: APIOperationError }>()
);

/*
     ___              _       
    / __|_ _ ___ __ _| |_ ___ 
   | (__| '_/ -_) _` |  _/ -_)
    \___|_| \___\__,_|\__\___|
                              
*/

export const editPassportDocument = createAction(
  '[Passport|ChangeMaker] Edit Passport',
  props<{ document: PassportDocumentStoreModel; newName: string }>()
);

export const editPassportDocumentSuccess = createAction(
  '[Passport|ChangeMaker] Edit Passport Success',
  props<{ document: PassportDocumentStoreModel }>()
);

export const editPassportDocumentError = createAction(
  '[Passport|ChangeMaker] Edit Passport Error',
  props<{ error: APIOperationError }>()
);

/*
    ___          _             
   | _ \___ _ __| |__ _ __ ___ 
   |   / -_) '_ \ / _` / _/ -_)
   |_|_\___| .__/_\__,_\__\___|
           |_|                 
*/
export const replacePassportDocument = createAction(
  '[Passport|ChangeMaker] Replace Passport',
  props<{ document: PassportDocumentStoreModel; file: File }>()
);

export const replacePassportDocumentSuccess = createAction(
  '[Passport|ChangeMaker] Replace Passport Success',
  props<{ document: PassportDocumentStoreModel }>()
);

export const replacePassportDocumentError = createAction(
  '[Passport|ChangeMaker] Replace Passport Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _       
   |   \ ___| |___| |_ ___ 
   | |) / -_) / -_)  _/ -_)
   |___/\___|_\___|\__\___|
                           
*/

export const deletePassportDocument = createAction(
  '[Passport|ChangeMaker] Delete Passport',
  props<{ document: PassportDocumentStoreModel }>()
);

export const deletePassportDocumentSuccess = createAction(
  '[Passport|ChangeMaker] Delete Passport Success',
  props<{ deletedId: string }>()
);

export const deletePassportDocumentError = createAction(
  '[Passport|ChangeMaker] Delete Passport Error',
  props<{ error: APIOperationError }>()
);
