import { ProjectFeedStoreModel } from '@involvemint/client/shared/data-access';
import { LinkPassportDocumentDto, APIOperationError, SubmitEnrollmentApplicationDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { EnrollmentStoreModel } from './enrollments.reducer';

export const refreshEnrollments = createAction('[Enrollments|ChangeMaker] Enrollments Refresh');
export const loadEnrollments = createAction('[Enrollments|ChangeMaker] Enrollments Load');

export const loadEnrollmentsSuccess = createAction(
  '[Enrollments|ChangeMaker] Enrollments Load Success',
  props<{ enrollments: EnrollmentStoreModel[] }>()
);

export const loadEnrollmentsError = createAction(
  '[Enrollments|ChangeMaker] Enrollments Load Error',
  props<{ error: APIOperationError }>()
);

/*
    ___ _            _       _             _ _         _   _          
   / __| |_ __ _ _ _| |_    /_\  _ __ _ __| (_)__ __ _| |_(_)___ _ _  
   \__ \  _/ _` | '_|  _|  / _ \| '_ \ '_ \ | / _/ _` |  _| / _ \ ' \ 
   |___/\__\__,_|_|  \__| /_/ \_\ .__/ .__/_|_\__\__,_|\__|_\___/_||_|
                                |_|  |_|                              
*/

export const startApplication = createAction(
  '[Enrollments|ChangeMaker] Start Application',
  props<{ project: ProjectFeedStoreModel }>()
);

export const startApplicationSuccess = createAction(
  '[Enrollments|ChangeMaker] Start Application Success',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const startApplicationError = createAction(
  '[Enrollments|ChangeMaker] Start Application Error',
  props<{ error: APIOperationError }>()
);

/*
   __      ___ _   _       _                     _             _ _         _   _          
   \ \    / (_) |_| |_  __| |_ _ __ ___ __ __   /_\  _ __ _ __| (_)__ __ _| |_(_)___ _ _  
    \ \/\/ /| |  _| ' \/ _` | '_/ _` \ V  V /  / _ \| '_ \ '_ \ | / _/ _` |  _| / _ \ ' \ 
     \_/\_/ |_|\__|_||_\__,_|_| \__,_|\_/\_/  /_/ \_\ .__/ .__/_|_\__\__,_|\__|_\___/_||_|
                                                    |_|  |_|                              
*/
export const withdrawEnrollment = createAction(
  '[Enrollments|ChangeMaker] Withdraw Application',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const withdrawEnrollmentSuccess = createAction(
  '[Enrollments|ChangeMaker] Withdraw Application Success',
  props<{ deletedId: string }>()
);

export const withdrawEnrollmentError = createAction(
  '[Enrollments|ChangeMaker] Withdraw Application Error',
  props<{ error: APIOperationError }>()
);

/*
    _    _      _   
   | |  (_)_ _ | |__
   | |__| | ' \| / /
   |____|_|_||_|_\_\
                    
*/

export const linkPassportDocument = createAction(
  '[Enrollments|ChangeMaker] Link Passport',
  props<{ dto: LinkPassportDocumentDto }>()
);

export const linkPassportDocumentSuccess = createAction(
  '[Enrollments|ChangeMaker] Link Passport Success',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const linkPassportDocumentError = createAction(
  '[Enrollments|ChangeMaker] Link Passport Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _          _ _   
   / __|_  _| |__ _ __ (_) |_ 
   \__ \ || | '_ \ '  \| |  _|
   |___/\_,_|_.__/_|_|_|_|\__|
                              
*/

export const submitApplication = createAction(
  '[Enrollments|ChangeMaker] Submit Application',
  props<{ dto: SubmitEnrollmentApplicationDto }>()
);

export const submitApplicationSuccess = createAction(
  '[Enrollments|ChangeMaker] Submit Application Success',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const submitApplicationError = createAction(
  '[Enrollments|ChangeMaker] Submit Application Error',
  props<{ error: APIOperationError }>()
);

/*
      _                  _    __      __    _             
     /_\  __ __ ___ _ __| |_  \ \    / /_ _(_)_ _____ _ _ 
    / _ \/ _/ _/ -_) '_ \  _|  \ \/\/ / _` | \ V / -_) '_|
   /_/ \_\__\__\___| .__/\__|   \_/\_/\__,_|_|\_/\___|_|  
                   |_|                                    
*/
export const acceptWaiver = createAction(
  '[Enrollments|ChangeMaker] Accept Waiver',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const acceptWaiverSuccess = createAction(
  '[Enrollments|ChangeMaker] Accept Waiver Success',
  props<{ enrollment: EnrollmentStoreModel }>()
);

export const acceptWaiverError = createAction(
  '[Enrollments|ChangeMaker] Accept Waiver Error',
  props<{ error: APIOperationError }>()
);
