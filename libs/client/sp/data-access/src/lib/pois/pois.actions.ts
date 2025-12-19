import { createAction, props } from '@ngrx/store';
import { PoiSpStoreModel } from './pois.reducer';
import { APIOperationError } from '@involvemint/shared/domain';

export const refreshPois = createAction('[Pois|ServePartner] Proofs of Impact Refresh');
export const loadPoisByProject = createAction(
  '[Pois|ServePartner] Proofs of Impact By Project Load',
  props<{ projectId: string }>()
);

export const loadPoisByProjectSuccess = createAction(
  '[Pois|ServePartner] Proofs of Impact By Project Load Success',
  props<{ pois: PoiSpStoreModel[]; projectId: string }>()
);

export const loadPoisByProjectError = createAction(
  '[Pois|ServePartner] Proofs of Impact By Project Load Error',
  props<{ error: APIOperationError }>()
);

/*
      _                             
     /_\  _ __ _ __ _ _ _____ _____ 
    / _ \| '_ \ '_ \ '_/ _ \ V / -_)
   /_/ \_\ .__/ .__/_| \___/\_/\___|
         |_|  |_|                   
*/
export const approvePoi = createAction(
  '[Pois|ServePartner] Approve Proof of Impact',
  props<{ poi: PoiSpStoreModel }>()
);

export const approvePoiSuccess = createAction(
  '[Pois|ServePartner] Approve Proof of Impact Success',
  props<{ poi: PoiSpStoreModel }>()
);

export const approvePoiError = createAction(
  '[Pois|ServePartner] Approve Proof of Impact Error',
  props<{ error: APIOperationError }>()
);
