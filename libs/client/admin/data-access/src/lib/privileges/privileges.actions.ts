import { GrantBaPrivilegesDto, APIOperationError, RevokeBaPrivilegesDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { BaPrivilegeStoreModel } from './privileges.reducer';

export const refreshPrivileges = createAction('[Admin|Privileges] Refresh Privileges');
export const loadPrivileges = createAction('[Admin|Privileges] Load Privileges');
export const loadPrivilegesSuccess = createAction(
  '[Admin|Privileges] Load Privileges Success',
  props<{ baPrivileges: BaPrivilegeStoreModel[] }>()
);
export const loadPrivilegesError = createAction(
  '[Admin|Privileges] Load Privileges Error',
  props<{ error: APIOperationError }>()
);

export const grantBAPrivilege = createAction(
  '[Admin|Privileges] Grant BA Privilege',
  props<{ dto: GrantBaPrivilegesDto }>()
);
export const grantBAPrivilegeSuccess = createAction(
  '[Admin|Privileges] Grant BA Privilege Success',
  props<{ user: BaPrivilegeStoreModel }>()
);
export const grantBAPrivilegeError = createAction(
  '[Admin|Privileges] Grant BA Privilege Error',
  props<{ error: APIOperationError }>()
);

export const revokeBAPrivilege = createAction(
  '[Admin|Privileges] Revoke BA Privilege',
  props<{ dto: RevokeBaPrivilegesDto }>()
);
export const revokeBAPrivilegeSuccess = createAction(
  '[Admin|Privileges] Revoke BA Privilege Success',
  props<{ user: BaPrivilegeStoreModel }>()
);
export const revokeBAPrivilegeError = createAction(
  '[Admin|Privileges] Revoke BA Privilege Error',
  props<{ error: APIOperationError }>()
);
