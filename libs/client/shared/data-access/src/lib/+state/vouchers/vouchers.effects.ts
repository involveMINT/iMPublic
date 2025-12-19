import { Injectable } from '@angular/core';
import { StatusService } from '@involvemint/client/shared/util';
import { VoucherQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { EMPTY, from } from 'rxjs';
import { delayWhen, filter, map, switchMap, tap } from 'rxjs/operators';
import { ImProfileSelectModalService } from '../../modals/im-profile-select-modal/im-profile-select-modal.service';
import { UserFacade } from '../user.facade';
import { ConfirmVoucherPurchaseModalService } from './confirm-voucher-purchase-modal/confirm-voucher-purchase-modal.service';
import * as VouchersActions from './vouchers.actions';
import { VoucherRestClient } from '../../rest-clients';

@Injectable()
export class VouchersEffects {
  readonly loadVouchersForProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VouchersActions.loadVouchersForProfile),
      fetch({
        run: ({ profile }) =>
          this.voucher
            .getForProfile(VoucherQuery, { profileId: profile.id })
            .pipe(
              map((vouchers) =>
                VouchersActions.loadVouchersForProfileSuccess({ vouchers, profileId: profile.id })
              )
            ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return VouchersActions.loadVouchersForProfileError({ error });
        },
      })
    )
  );

  readonly buyVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VouchersActions.buyVoucher),
      fetch({
        run: ({ seller, offers }) =>
          from(
            this.profileSelect.open({ title: 'Select Profile', header: 'Who is buying this Voucher?' })
          ).pipe(
            filter((p) => !!p),
            switchMap((selectedProfile) => {
              if (!selectedProfile) {
                return EMPTY;
              }
              return from(
                this.confirmVoucherPurchase.open({ seller, offers, selectedProfile: selectedProfile })
              ).pipe(
                filter((p) => !!p),
                delayWhen(() => from(this.status.showLoader('Buying Voucher...'))),
                switchMap(() => {
                  const offersMapped = Array.from(offers.values()).map((o) => ({
                    offerId: o.offer.id,
                    quantity: o.quantity,
                  }));
                  return this.voucher.buy(VoucherQuery, {
                    offers: offersMapped,
                    buyerId: selectedProfile.id,
                    sellerId: seller.id,
                  });
                }),
                map((voucher) => {
                  this.user.credits.dispatchers.refresh();
                  return VouchersActions.buyVoucherSuccess({ voucher });
                })
              );
            })
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return VouchersActions.buyVoucherError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly voucher: VoucherRestClient,
    private readonly status: StatusService,
    private readonly profileSelect: ImProfileSelectModalService,
    private readonly user: UserFacade,
    private readonly confirmVoucherPurchase: ConfirmVoucherPurchaseModalService
  ) {}
}
