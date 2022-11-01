import { MintDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { OrchaOperationError } from '@orcha/common';

export const mint = createAction('[Admin|Applications] Mint', props<{ dto: MintDto }>());
export const mintSuccess = createAction('[Admin|Applications] Mint Success');
export const mintError = createAction(
  '[Admin|Applications] Mint Error',
  props<{ error: OrchaOperationError }>()
);
