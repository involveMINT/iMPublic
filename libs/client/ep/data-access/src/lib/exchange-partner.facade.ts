import { Injectable } from '@angular/core';
import { UserFacade } from '@involvemint/client/shared/data-access';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import * as EpAdminsActions from './ep-admins/ep-admins.actions';
import { EpAdminStoreModel } from './ep-admins/ep-admins.reducer';
import * as EpAdminsSelectors from './ep-admins/ep-admins.selectors';
import * as EpVouchersActions from './ep-vouchers/ep-vouchers.actions';
import { EpVoucherStoreModel } from './ep-vouchers/ep-vouchers.reducer';
import * as EpVouchersSelectors from './ep-vouchers/ep-vouchers.selectors';

@Injectable()
export class ExchangePartnerFacade {
  readonly epAdmins = {
    dispatchers: {
      refresh: () => {
        this.user.session.selectors.activeProfileEp$.pipe(take(1)).subscribe((ep) => {
          this.store.dispatch(EpAdminsActions.refreshEpAdmins({ epId: ep.id }));
        });
      },
      addEpAdmin: (userId: string) => {
        this.store.dispatch(EpAdminsActions.addEpAdmin({ userId }));
      },
      removeEpAdmin: (epAdmin: EpAdminStoreModel) => {
        this.store.dispatch(EpAdminsActions.removeEpAdmin({ epAdmin }));
      },
    },
    selectors: {
      epAdmins$: this.user.session.selectors.activeProfileEp$.pipe(
        switchMap((activeAccount) =>
          this.store.pipe(
            select(EpAdminsSelectors.getState),
            map((state) => {
              const loaded = state.profileLoaded.includes(activeAccount.id);
              if (!loaded) {
                this.store.dispatch(EpAdminsActions.loadEpAdmins());
              }
              return {
                loaded,
                epAdmins: state.epAdmins.filter((p) => p.exchangePartner.id === activeAccount.id),
              };
            })
          )
        )
      ),
    },
  };

  readonly epVouchers = {
    dispatchers: {
      refresh: () => {
        this.user.session.selectors.activeProfileEp$.pipe(take(1)).subscribe((ep) => {
          this.store.dispatch(EpVouchersActions.refreshVouchers({ epId: ep.id }));
        });
      },
      redeemVoucher: (voucher: EpVoucherStoreModel) => {
        this.store.dispatch(EpVouchersActions.redeemVoucher({ voucher }));
      },
      refundVoucher: (voucher: EpVoucherStoreModel) => {
        this.store.dispatch(EpVouchersActions.refundVoucher({ voucher }));
      },
      archiveVoucher: (voucher: EpVoucherStoreModel) => {
        this.store.dispatch(EpVouchersActions.archiveVoucher({ voucher }));
      },
      unarchiveVoucher: (voucher: EpVoucherStoreModel) => {
        this.store.dispatch(EpVouchersActions.unarchiveVoucher({ voucher }));
      },
    },
    selectors: {
      vouchers$: this.user.session.selectors.activeProfileEp$.pipe(
        switchMap((activeAccount) =>
          this.store.pipe(
            select(EpVouchersSelectors.getEpVouchers),
            map((state) => {
              const loaded = state.epAccountsLoaded.includes(activeAccount.id);
              if (!loaded) {
                this.store.dispatch(EpVouchersActions.loadVouchers());
              }
              return {
                loaded,
                vouchers: state.vouchers.filter((v) => v.seller.id === activeAccount.id),
              };
            })
          )
        )
      ),
      getVoucher: (voucherId: string) =>
        combineLatest([
          this.user.session.selectors.activeProfileEp$,
          this.store.pipe(select(EpVouchersSelectors.getVoucher(voucherId))),
        ]).pipe(
          map(([{ id }, state]) => {
            const loaded = state.epAccountsLoaded.includes(id);
            if (!loaded) {
              this.store.dispatch(EpVouchersActions.loadVouchers());
            }
            return {
              loaded,
              voucher: state.voucher?.seller.id === id ? state.voucher : undefined,
            };
          })
        ),
    },
  };

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly user: UserFacade
  ) {}
}
