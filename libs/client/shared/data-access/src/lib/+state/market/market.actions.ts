import { createAction, props } from '@ngrx/store';
import {
  ExchangePartnerMarketStoreModel,
  OfferMarketStoreModel,
  RequestMarketStoreModel,
} from './market.reducer';
import { APIOperationError } from '@involvemint/shared/domain';

export const marketRefresh = createAction('[Market] Refresh');

export const exchangePartnersMarketLoad = createAction('[Market|ExchangePartners] ExchangePartners Load');

export const exchangePartnersMarketLoadSuccess = createAction(
  '[Market|ExchangePartners] ExchangePartners Load Success',
  props<{ items: ExchangePartnerMarketStoreModel[] }>()
);

export const exchangePartnersMarketLoadError = createAction(
  '[Market|ExchangePartners]  ExchangePartners Load Error',
  props<{ error: APIOperationError }>()
);

/*
     ___     _      ___             ___ ___ 
    / __|___| |_   / _ \ _ _  ___  | __| _ \
   | (_ / -_)  _| | (_) | ' \/ -_) | _||  _/
    \___\___|\__|  \___/|_||_\___| |___|_|  
                                            
*/

export const getOneExchangePartner = createAction(
  '[Market|ExchangePartners] Get One ExchangePartner',
  props<{ epId: string }>()
);

export const getOneExchangePartnerSuccess = createAction(
  '[Market|ExchangePartners] Get One ExchangePartner Success',
  props<{ exchangePartner: ExchangePartnerMarketStoreModel }>()
);

export const getOneExchangePartnerError = createAction(
  '[Market|ExchangePartners]  Get One ExchangePartner Error',
  props<{ error: APIOperationError }>()
);

/*
     ___   __  __            
    / _ \ / _|/ _|___ _ _ ___
   | (_) |  _|  _/ -_) '_(_-<
    \___/|_| |_| \___|_| /__/
                             
*/

export const offersMarketLoad = createAction('[Market|Offers] Offers Load', props<{ page: number }>());

export const offersMarketLoadSuccess = createAction(
  '[Market|Offers] Offers Load Success',
  props<{ items: OfferMarketStoreModel[]; page: number }>()
);

export const offersMarketLoadError = createAction(
  '[Market|Offers]  Offers Load Error',
  props<{ error: APIOperationError }>()
);

/*
     ___     _      ___              ___   __  __         
    / __|___| |_   / _ \ _ _  ___   / _ \ / _|/ _|___ _ _ 
   | (_ / -_)  _| | (_) | ' \/ -_) | (_) |  _|  _/ -_) '_|
    \___\___|\__|  \___/|_||_\___|  \___/|_| |_| \___|_|  
                                                          
*/
export const getOneOffer = createAction('[Market|Offers] Get One Offer', props<{ offerId: string }>());

export const getOneOfferSuccess = createAction(
  '[Market|Offers] Get One Offer Success',
  props<{ offer: OfferMarketStoreModel }>()
);

export const getOneOfferError = createAction(
  '[Market|Offers]  Get One Offer Error',
  props<{ error: APIOperationError }>()
);

/*
    ___                      _      
   | _ \___ __ _ _  _ ___ __| |_ ___
   |   / -_) _` | || / -_|_-<  _(_-<
   |_|_\___\__, |\_,_\___/__/\__/__/
              |_|                   
  
*/

export const requestsMarketLoad = createAction('[Market|Requests] Requests Load', props<{ page: number }>());

export const requestsMarketLoadSuccess = createAction(
  '[Market|Requests] Requests Load Success',
  props<{ items: RequestMarketStoreModel[]; page: number }>()
);

export const requestsMarketLoadError = createAction(
  '[Market|Offers]  Requests Load Error',
  props<{ error: APIOperationError }>()
);

/*
     ___     _      ___             ___                      _   
    / __|___| |_   / _ \ _ _  ___  | _ \___ __ _ _  _ ___ __| |_ 
   | (_ / -_)  _| | (_) | ' \/ -_) |   / -_) _` | || / -_|_-<  _|
    \___\___|\__|  \___/|_||_\___| |_|_\___\__, |\_,_\___/__/\__|
                                              |_|                
*/
export const getOneRequest = createAction(
  '[Market|Requests] Get One Request',
  props<{ requestId: string }>()
);

export const getOneRequestSuccess = createAction(
  '[Market|Requests] Get One Request Success',
  props<{ request: RequestMarketStoreModel }>()
);

export const getOneRequestError = createAction(
  '[Market|Requests]  Get One Request Error',
  props<{ error: APIOperationError }>()
);
