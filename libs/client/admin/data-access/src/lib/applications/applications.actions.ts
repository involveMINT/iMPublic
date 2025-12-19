import { ProcessEpApplicationDto, ProcessSpApplicationDto, APIOperationError } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { EpApplicationStoreModel, SpApplicationStoreModel } from './applications.reducer';

export const refreshApplications = createAction('[Admin|Applications] Refresh Applications');
export const loadApplications = createAction('[Admin|Applications] Load Applications');
export const loadApplicationsSuccess = createAction(
  '[Admin|Applications] Load Applications Success',
  props<{ epApplications: EpApplicationStoreModel[]; spApplications: SpApplicationStoreModel[] }>()
);
export const loadApplicationsError = createAction(
  '[Admin|Applications] Load Applications Error',
  props<{ error: APIOperationError }>()
);

export const processEpApplication = createAction(
  '[Admin|Applications] Process Ep Application',
  props<{ dto: ProcessEpApplicationDto }>()
);
export const processEpApplicationSuccess = createAction(
  '[Admin|Applications] Process Ep Application Success',
  props<{ applicationId: string }>()
);
export const processEpApplicationError = createAction(
  '[Admin|Applications] Process Ep Application Error',
  props<{ error: APIOperationError }>()
);

export const processSpApplication = createAction(
  '[Admin|Applications] Process Sp Application',
  props<{ dto: ProcessSpApplicationDto }>()
);
export const processSpApplicationSuccess = createAction(
  '[Admin|Applications] Process Sp Application Success',
  props<{ applicationId: string }>()
);
export const processSpApplicationError = createAction(
  '[Admin|Applications] Process Sp Application Error',
  props<{ error: APIOperationError }>()
);
