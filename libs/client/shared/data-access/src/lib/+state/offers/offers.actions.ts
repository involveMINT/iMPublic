import { DeleteOfferImageDto, APIOperationError, UpdateOfferDto } from '@involvemint/shared/domain';
import { createAction, props } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { OfferStoreModel } from './offers.reducer';

export const refreshOffersForProfile = createAction(
  '[Offers] Offers Refresh For Profile',
  props<{ profile: ActiveProfile }>()
);
export const loadOffersForProfile = createAction(
  '[Offers] Offers Load For Profile',
  props<{ profile: ActiveProfile }>()
);

export const loadOffersForProfileSuccess = createAction(
  '[Offers] Offers Load For Profile Success',
  props<{ offers: OfferStoreModel[]; profileId: string }>()
);

export const loadOffersForProfileError = createAction(
  '[Offers] Offers Load For Profile Error',
  props<{ error: APIOperationError }>()
);

/*
     ___              _       
    / __|_ _ ___ __ _| |_ ___ 
   | (__| '_/ -_) _` |  _/ -_)
    \___|_| \___\__,_|\__\___|
                              
*/
export const createOffer = createAction('[Offers] Create Offer', props<{ returnToEpStorefront: boolean }>());

export const createOfferSuccess = createAction(
  '[Offers] Create Offer Success',
  props<{ offer: OfferStoreModel }>()
);

export const createOfferError = createAction(
  '[Offers] Create Offer Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _          _      _       
   | | | |_ __  __| |__ _| |_ ___ 
   | |_| | '_ \/ _` / _` |  _/ -_)
    \___/| .__/\__,_\__,_|\__\___|
         |_|                      
*/
export const updateOffer = createAction('[Offers] Update Offer', props<{ dto: UpdateOfferDto }>());

export const updateOfferSuccess = createAction(
  '[Offers] Update Offer Success',
  props<{ offer: OfferStoreModel }>()
);

export const updateOfferError = createAction(
  '[Offers] Update Offer Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _       
   |   \ ___| |___| |_ ___ 
   | |) / -_) / -_)  _/ -_)
   |___/\___|_\___|\__\___|
                           
*/

export const deleteOffer = createAction(
  '[Offers] Delete Offer',
  props<{ offer: OfferStoreModel; returnToEpStorefront: boolean }>()
);

export const deleteOfferSuccess = createAction(
  '[Offers] Delete Offer Success',
  props<{ deletedId: string }>()
);

export const deleteOfferError = createAction(
  '[Offers] Delete Offer Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _      _              _   ___                        
   | | | |_ __| |___  __ _ __| | |_ _|_ __  __ _ __ _ ___ ___
   | |_| | '_ \ / _ \/ _` / _` |  | || '  \/ _` / _` / -_|_-<
    \___/| .__/_\___/\__,_\__,_| |___|_|_|_\__,_\__, \___/__/
         |_|                                    |___/        
*/
export const uploadImages = createAction(
  '[Offers] Upload Offer Images',
  props<{ offer: OfferStoreModel; images: File[] }>()
);

export const uploadImagesSuccess = createAction(
  '[Offers] Upload Offer Images Success',
  props<{ offer: OfferStoreModel }>()
);

export const uploadImagesError = createAction(
  '[Offers] Upload Offer Images Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      _     _         ___                     
   |   \ ___| |___| |_ ___  |_ _|_ __  __ _ __ _ ___ 
   | |) / -_) / -_)  _/ -_)  | || '  \/ _` / _` / -_)
   |___/\___|_\___|\__\___| |___|_|_|_\__,_\__, \___|
                                           |___/     
*/
export const deleteImage = createAction('[Offers] Delete Offer Image', props<{ dto: DeleteOfferImageDto }>());

export const deleteImageSuccess = createAction(
  '[Offers] Delete Offer Image Success',
  props<{ offer: OfferStoreModel }>()
);

export const deleteImageError = createAction(
  '[Offers] Delete Offer Image Error',
  props<{ error: APIOperationError }>()
);
