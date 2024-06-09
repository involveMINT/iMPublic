import { EpVoucherQuery, Voucher, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as EpVoucherActions from './ep-vouchers.actions';

export const EP_VOUCHERS_KEY = 'epVouchers';

export type EpVoucherStoreModel = IParser<Voucher, typeof EpVoucherQuery>;

export interface EpVouchersState {
  vouchers: EntityState<EpVoucherStoreModel>;
  epAccountsLoaded: string[];
}

export const epVouchersAdapter = createEntityAdapter<EpVoucherStoreModel>();

const initialState: EpVouchersState = {
  vouchers: epVouchersAdapter.getInitialState(),
  epAccountsLoaded: [],
};

export const EpVouchersReducer = createReducer(
  initialState,
  on(
    EpVoucherActions.refreshVouchers,
    (state, { epId }): EpVouchersState => ({
      ...state,
      epAccountsLoaded: state.epAccountsLoaded.filter((ep) => ep !== epId),
    })
  ),
  on(
    EpVoucherActions.loadVouchersSuccess,
    (state, { vouchers, epId }): EpVouchersState => ({
      ...state,
      vouchers: epVouchersAdapter.setAll(vouchers, state.vouchers),
      epAccountsLoaded: [...state.epAccountsLoaded, epId],
    })
  ),
  on(
    EpVoucherActions.redeemVoucherSuccess,
    (state, { voucher }): EpVouchersState => ({
      ...state,
      vouchers: epVouchersAdapter.upsertOne(voucher, state.vouchers),
    })
  ),
  on(
    EpVoucherActions.refundVoucherSuccess,
    (state, { voucher }): EpVouchersState => ({
      ...state,
      vouchers: epVouchersAdapter.upsertOne(voucher, state.vouchers),
    })
  ),
  on(
    EpVoucherActions.archiveVoucherSuccess,
    (state, { voucher }): EpVouchersState => ({
      ...state,
      vouchers: epVouchersAdapter.upsertOne(voucher, state.vouchers),
    })
  ),
  on(
    EpVoucherActions.unarchiveVoucherSuccess,
    (state, { voucher }): EpVouchersState => ({
      ...state,
      vouchers: epVouchersAdapter.upsertOne(voucher, state.vouchers),
    })
  )
);
