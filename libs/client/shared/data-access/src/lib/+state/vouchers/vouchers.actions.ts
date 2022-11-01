import { UnArray } from '@involvemint/shared/util';
import { createAction, props } from '@ngrx/store';
import { OrchaOperationError } from '@orcha/common';
import { ExchangePartnerMarketStoreModel } from '../market/market.reducer';
import { ActiveProfile } from '../session/user-session.reducer';
import { VoucherStoreModel } from './vouchers.reducer';

export const refreshVouchersForProfile = createAction(
  '[Vouchers] Vouchers Refresh For Profile',
  props<{ profile: ActiveProfile }>()
);
export const loadVouchersForProfile = createAction(
  '[Vouchers] Vouchers Load For Profile',
  props<{ profile: ActiveProfile }>()
);

export const loadVouchersForProfileSuccess = createAction(
  '[Vouchers] Vouchers Load For Profile Success',
  props<{ vouchers: VoucherStoreModel[]; profileId: string }>()
);

export const loadVouchersForProfileError = createAction(
  '[Vouchers] Vouchers Load For Profile Error',
  props<{ error: OrchaOperationError }>()
);

/*
    ___           
   | _ )_  _ _  _ 
   | _ \ || | || |
   |___/\_,_|\_, |
             |__/ 
*/
export const buyVoucher = createAction(
  '[Vouchers] Buy Voucher',
  props<{
    seller: ExchangePartnerMarketStoreModel;
    offers: Array<{ offer: UnArray<ExchangePartnerMarketStoreModel['offers']>; quantity: number }>;
  }>()
);

export const buyVoucherSuccess = createAction(
  '[Vouchers] Buy Voucher Success',
  props<{ voucher: VoucherStoreModel }>()
);

export const buyVoucherError = createAction(
  '[Vouchers] Buy Voucher Error',
  props<{ error: OrchaOperationError }>()
);
