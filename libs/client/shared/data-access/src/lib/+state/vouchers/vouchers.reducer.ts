import { Voucher, VoucherQuery, IParser } from '@involvemint/shared/domain';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as VouchersActions from './vouchers.actions';

export const VOUCHERS_KEY = 'vouchers';

export type VoucherStoreModel = IParser<Voucher, typeof VoucherQuery>;

export interface VouchersState {
  vouchers: EntityState<VoucherStoreModel>;
  profileLoaded: string[];
}

export const vouchersAdapter = createEntityAdapter<VoucherStoreModel>();

const initialState: VouchersState = {
  vouchers: vouchersAdapter.getInitialState(),
  profileLoaded: [],
};

export const VoucherReducer = createReducer(
  initialState,
  on(
    VouchersActions.refreshVouchersForProfile,
    (state, { profile }): VouchersState => {
      return {
        ...state,
        profileLoaded: state.profileLoaded.filter((p) => p !== profile.id),
      };
    }
  ),
  on(
    VouchersActions.loadVouchersForProfileSuccess,
    (state, { vouchers, profileId }): VouchersState => {
      return {
        ...state,
        vouchers: vouchersAdapter.upsertMany(vouchers, state.vouchers),
        profileLoaded: [...state.profileLoaded, profileId],
      };
    }
  ),
  on(
    VouchersActions.buyVoucherSuccess,
    (state, { voucher }): VouchersState => {
      return {
        ...state,
        vouchers: vouchersAdapter.upsertOne(voucher, state.vouchers),
      };
    }
  )
);
