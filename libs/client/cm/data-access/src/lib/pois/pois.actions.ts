import { LatLng } from '@involvemint/client/shared/util';
import { APIOperationError, QuestionAnswersDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { EnrollmentStoreModel } from '../enrollments/enrollments.reducer';
import { PoiCmStoreModel } from './pois.reducer';

export const refreshPois = createAction('[Pois|ChangeMaker] Proofs of Impact Refresh');
export const loadPois = createAction('[Pois|ChangeMaker] Proofs of Impact Load', props<{ page: number }>());

export const loadPoisSuccess = createAction(
  '[Pois|ChangeMaker] Proofs of Impact Load Success',
  props<{ pois: PoiCmStoreModel[]; page: number }>()
);

export const loadPoisError = createAction(
  '[Pois|ChangeMaker] Proofs of Impact Load Error',
  props<{ error: APIOperationError }>()
);

/*
     ___              _       
    / __|_ _ ___ __ _| |_ ___ 
   | (__| '_/ -_) _` |  _/ -_)
    \___|_| \___\__,_|\__\___|
                              
*/
export const createPoi = createAction(
  '[Pois|ChangeMaker] Create Proof of Impact',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const createPoiSuccess = createAction(
  '[Pois|ChangeMaker] Create Proof of Impact Success',
  props<{ poi: PoiCmStoreModel }>()
);

export const createPoiError = createAction(
  '[Pois|ChangeMaker] Create Proof of Impact Error',
  props<{ error: APIOperationError }>()
);

/*
    ___ _            _   
   / __| |_ __ _ _ _| |_ 
   \__ \  _/ _` | '_|  _|
   |___/\__\__,_|_|  \__|
                         
*/
export const startPoi = createAction(
  '[Pois|ChangeMaker] Start Proof of Impact',
  props<{ poi: PoiCmStoreModel; latLng?: LatLng }>()
);

export const startPoiSuccess = createAction(
  '[Pois|ChangeMaker] Start Proof of Impact Success',
  props<{ poi: PoiCmStoreModel }>()
);

export const startPoiError = createAction(
  '[Pois|ChangeMaker] Start Proof of Impact Error',
  props<{ error: APIOperationError }>()
);

/*
   __      ___ _   _       _                 
   \ \    / (_) |_| |_  __| |_ _ __ ___ __ __
    \ \/\/ /| |  _| ' \/ _` | '_/ _` \ V  V /
     \_/\_/ |_|\__|_||_\__,_|_| \__,_|\_/\_/ 
                                             
*/
export const withdrawPoi = createAction(
  '[Pois|ChangeMaker] Withdraw Proof of Impact',
  props<{ poi: PoiCmStoreModel }>()
);

export const withdrawPoiSuccess = createAction(
  '[Pois|ChangeMaker] Withdraw Proof of Impact Success',
  props<{ deletedId: string }>()
);

export const withdrawPoiError = createAction(
  '[Pois|ChangeMaker] Withdraw Proof of Impact Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                   
   | _ \__ _ _  _ ___ ___ 
   |  _/ _` | || (_-</ -_)
   |_| \__,_|\_,_/__/\___|
                          
*/
export const pausePoi = createAction(
  '[Pois|ChangeMaker] Pause Proof of Impact',
  props<{ poi: PoiCmStoreModel }>()
);

export const pausePoiSuccess = createAction(
  '[Pois|ChangeMaker] Pause Proof of Impact Success',
  props<{ poi: PoiCmStoreModel }>()
);

export const pausePoiError = createAction(
  '[Pois|ChangeMaker] Pause Proof of Impact Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                       
   | _ \___ ____  _ _ __  ___ 
   |   / -_|_-< || | '  \/ -_)
   |_|_\___/__/\_,_|_|_|_\___|
                              
*/
export const resumePoi = createAction(
  '[Pois|ChangeMaker] Resume Proof of Impact',
  props<{ poi: PoiCmStoreModel }>()
);

export const resumePoiSuccess = createAction(
  '[Pois|ChangeMaker] Resume Proof of Impact Success',
  props<{ poi: PoiCmStoreModel }>()
);

export const resumePoiError = createAction(
  '[Pois|ChangeMaker] Resume Proof of Impact Error',
  props<{ error: APIOperationError }>()
);

/*
  ___ _            
 / __| |_ ___ _ __ 
 \__ \  _/ _ \ '_ \
 |___/\__\___/ .__/
             |_|   
*/
export const stopPoi = createAction(
  '[Pois|ChangeMaker] Stop Proof of Impact',
  props<{ poi: PoiCmStoreModel }>()
);

export const stopPoiSuccess = createAction(
  '[Pois|ChangeMaker] Stop Proof of Impact Success',
  props<{ poi: PoiCmStoreModel }>()
);

export const stopPoiError = createAction(
  '[Pois|ChangeMaker] Stop Proof of Impact Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _          _ _   
   / __|_  _| |__ _ __ (_) |_ 
   \__ \ || | '_ \ '  \| |  _|
   |___/\_,_|_.__/_|_|_|_|\__|
                              
*/
export const submitPoi = createAction(
  '[Pois|ChangeMaker] Submit Proof of Impact',
  props<{ poi: PoiCmStoreModel; files: File[]; answers: QuestionAnswersDto[] }>()
);

export const submitPoiSuccess = createAction(
  '[Pois|ChangeMaker] Submit Proof of Impact Success',
  props<{ poi: PoiCmStoreModel }>()
);

export const submitPoiError = createAction(
  '[Pois|ChangeMaker] Submit Proof of Impact Error',
  props<{ error: APIOperationError }>()
);
