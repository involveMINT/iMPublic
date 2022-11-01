import { createFeatureSelector, createSelector } from '@ngrx/store';
import { epVouchersAdapter, EpVouchersState, EP_VOUCHERS_KEY } from './ep-vouchers.reducer';

const getEpVouchersState = createFeatureSelector<EpVouchersState>(EP_VOUCHERS_KEY);

const { selectAll, selectEntities } = epVouchersAdapter.getSelectors();

export const getEpVouchers = createSelector(getEpVouchersState, (state: EpVouchersState) => ({
  vouchers: selectAll(state.vouchers),
  epAccountsLoaded: state.epAccountsLoaded,
}));

export const getVoucher = (voucherId: string) =>
  createSelector(getEpVouchersState, (state: EpVouchersState) => ({
    voucher: selectEntities(state.vouchers)[voucherId],
    epAccountsLoaded: state.epAccountsLoaded,
  }));
