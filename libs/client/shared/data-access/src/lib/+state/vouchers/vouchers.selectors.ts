import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ActiveProfile } from '../session/user-session.reducer';
import { vouchersAdapter, VouchersState, VOUCHERS_KEY } from './vouchers.reducer';

const { selectAll } = vouchersAdapter.getSelectors();

const getVouchersState = createFeatureSelector<VouchersState>(VOUCHERS_KEY);

export const getVouchersByProfile = (profile: ActiveProfile) =>
  createSelector(getVouchersState, (state: VouchersState) => ({
    vouchers: selectAll(state.vouchers).filter(
      (voucher) =>
        voucher.changeMakerReceiver?.id === profile.id ||
        voucher.servePartnerReceiver?.id === profile.id ||
        voucher.exchangePartnerReceiver?.id === profile.id
    ),
    profileLoaded: state.profileLoaded,
  }));
