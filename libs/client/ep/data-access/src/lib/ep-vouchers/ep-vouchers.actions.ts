import { createAction, props } from '@ngrx/store';
import { EpVoucherStoreModel } from './ep-vouchers.reducer';
import { APIOperationError } from '@involvemint/shared/domain';

export const refreshVouchers = createAction(
  '[ExchangePartner|Vouchers] Refresh Vouchers',
  props<{ epId: string }>()
);

export const loadVouchers = createAction('[ExchangePartner|Vouchers] Load Vouchers');

export const loadVouchersSuccess = createAction(
  '[ExchangePartner|Vouchers] Load Vouchers Success',
  props<{ vouchers: EpVoucherStoreModel[]; epId: string }>()
);

export const loadVouchersError = createAction(
  '[ExchangePartner|Vouchers] Load Vouchers Error',
  props<{ error: APIOperationError }>()
);

/*
    ___        _
   | _ \___ __| |___ ___ _ __
   |   / -_) _` / -_) -_) '  \
   |_|_\___\__,_\___\___|_|_|_|
*/
export const redeemVoucher = createAction(
  '[ExchangePartner|Vouchers] Redeem Voucher',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const redeemVoucherSuccess = createAction(
  '[ExchangePartner|Vouchers] Redeem Voucher Success',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const redeemVoucherError = createAction(
  '[ExchangePartner|Vouchers] Redeem Voucher Error',
  props<{ error: APIOperationError }>()
);

/*
    ___      __              _
   | _ \___ / _|_  _ _ _  __| |
   |   / -_)  _| || | ' \/ _` |
   |_|_\___|_|  \_,_|_||_\__,_|

*/
export const refundVoucher = createAction(
  '[ExchangePartner|Vouchers] Refund Voucher',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const refundVoucherSuccess = createAction(
  '[ExchangePartner|Vouchers] Refund Voucher Success',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const refundVoucherError = createAction(
  '[ExchangePartner|Vouchers] Refund Voucher Error',
  props<{ error: APIOperationError }>()
);

/*
      _          _    _
     /_\  _ _ __| |_ (_)_ _____
    / _ \| '_/ _| ' \| \ V / -_)
   /_/ \_\_| \__|_||_|_|\_/\___|

*/

export const archiveVoucher = createAction(
  '[ExchangePartner|Vouchers] Archive Voucher',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const archiveVoucherSuccess = createAction(
  '[ExchangePartner|Vouchers] Archive Voucher Success',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const archiveVoucherError = createAction(
  '[ExchangePartner|Vouchers] Archive Voucher Error',
  props<{ error: APIOperationError }>()
);

/*
    _   _                  _    _
   | | | |_ _  __ _ _ _ __| |_ (_)_ _____
   | |_| | ' \/ _` | '_/ _| ' \| \ V / -_)
    \___/|_||_\__,_|_| \__|_||_|_|\_/\___|

*/

export const unarchiveVoucher = createAction(
  '[ExchangePartner|Vouchers] Unarchive Voucher',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const unarchiveVoucherSuccess = createAction(
  '[ExchangePartner|Vouchers] Unarchive Voucher Success',
  props<{ voucher: EpVoucherStoreModel }>()
);

export const unarchiveVoucherError = createAction(
  '[ExchangePartner|Vouchers] Unarchive Voucher Error',
  props<{ error: APIOperationError }>()
);
