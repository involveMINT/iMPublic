import { createAction, props } from '@ngrx/store';
import { OrchaOperationError } from '@orcha/common';
import { ActiveProfile } from '../session/user-session.reducer';
import { CreditStoreModel } from './credits.reducer';

export const refreshCreditsForProfile = createAction(
  '[Credits] Credits Refresh For Profile',
  props<{ profile: ActiveProfile }>()
);
export const loadCreditsForProfile = createAction(
  '[Credits] Credits Load For Profile',
  props<{ profile: ActiveProfile }>()
);

export const loadCreditsForProfileSuccess = createAction(
  '[Credits] Credits Load For Profile Success',
  props<{ credits: CreditStoreModel[]; profileId: string }>()
);

export const loadCreditsForProfileError = createAction(
  '[Credits] Credits Load For Profile Error',
  props<{ error: OrchaOperationError }>()
);
