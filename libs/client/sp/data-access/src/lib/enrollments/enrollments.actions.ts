import { GetEnrollmentsBySpProject, APIOperationError } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { EnrollmentSpStoreModel } from './enrollments.reducer';

export const loadEnrollments = createAction(
  '[ServePartner|Enrollments] Load Enrollments',
  props<GetEnrollmentsBySpProject>()
);

export const loadEnrollmentsSuccess = createAction(
  '[ServePartner|Enrollments] Load Enrollments Success',
  props<{ enrollments: EnrollmentSpStoreModel[]; dto: GetEnrollmentsBySpProject }>()
);

export const loadEnrollmentsError = createAction(
  '[ServePartner|Enrollments] Load Enrollments Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                       
   | _ \_ _ ___  __ ___ ______
   |  _/ '_/ _ \/ _/ -_|_-<_-<
   |_| |_| \___/\__\___/__/__/
                              
*/

export const processEnrollmentApplication = createAction(
  '[ServePartner|Projects] Process Enrollment Application',
  props<{ enrollment: EnrollmentSpStoreModel; approve: boolean }>()
);

export const processEnrollmentApplicationSuccess = createAction(
  '[ServePartner|Projects] Process Enrollment Application Success',
  props<{ enrollment: EnrollmentSpStoreModel }>()
);

export const processEnrollmentApplicationError = createAction(
  '[ServePartner|Projects] Process Enrollment Application Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                 _     ___          _     _____      ___             _ _           
   | _ \_____ _____ _ _| |_  | _ ) __ _ __| |__ |_   _|__  | _ \___ _ _  __| (_)_ _  __ _ 
   |   / -_) V / -_) '_|  _| | _ \/ _` / _| / /   | |/ _ \ |  _/ -_) ' \/ _` | | ' \/ _` |
   |_|_\___|\_/\___|_|  \__| |___/\__,_\__|_\_\   |_|\___/ |_| \___|_||_\__,_|_|_||_\__, |
                                                                                    |___/ 
*/
export const revertBackToPending = createAction(
  '[ServePartner|Projects] Revert Enrollment Application Back To Pending',
  props<{ enrollment: EnrollmentSpStoreModel }>()
);

export const revertBackToPendingSuccess = createAction(
  '[ServePartner|Projects] Revert Enrollment Application Back To Pending Success',
  props<{ enrollment: EnrollmentSpStoreModel }>()
);

export const revertBackToPendingError = createAction(
  '[ServePartner|Projects] Revert Enrollment Application Back To Pending Error',
  props<{ error: APIOperationError }>()
);

/*
    ___     _   _         
   | _ \___| |_(_)_ _ ___ 
   |   / -_)  _| | '_/ -_)
   |_|_\___|\__|_|_| \___|
                          
*/
export const retireEnrollment = createAction(
  '[ServePartner|Projects] Retire Enrollment',
  props<{ enrollment: EnrollmentSpStoreModel }>()
);

export const retireEnrollmentSuccess = createAction(
  '[ServePartner|Projects] Retire Enrollment Success',
  props<{ enrollment: EnrollmentSpStoreModel }>()
);

export const retireEnrollmentError = createAction(
  '[ServePartner|Projects] Retire Enrollment Error',
  props<{ error: APIOperationError }>()
);
