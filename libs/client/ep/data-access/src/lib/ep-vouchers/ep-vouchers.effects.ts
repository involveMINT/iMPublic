import { Injectable } from '@angular/core';
import { UserFacade, VoucherRestClient } from '@involvemint/client/shared/data-access';
import { InfoModalService, StatusService } from '@involvemint/client/shared/util';
import { EpVoucherQuery } from '@involvemint/shared/domain';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetch, pessimisticUpdate } from '@nrwl/angular';
import { from } from 'rxjs';
import { delayWhen, filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as EpVouchersActions from './ep-vouchers.actions';

@Injectable()
export class EpVouchersEffects {
  readonly loadVouchers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpVouchersActions.loadVouchers),
      fetch({
        run: () =>
          this.user.session.selectors.activeProfileEp$.pipe(
            take(1),
            switchMap(({ id: epId }) =>
              this.voucher
                .getBySeller(EpVoucherQuery, { epId })
                .pipe(map((vouchers) => EpVouchersActions.loadVouchersSuccess({ vouchers, epId })))
            )
          ),
        onError: (action, { error }) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpVouchersActions.loadVouchersError({ error });
        },
      })
    )
  );

  readonly redeemVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpVouchersActions.redeemVoucher),
      pessimisticUpdate({
        run: ({ voucher }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: `Are you sure you want to redeem this voucher for ${
                  voucher.amount / 100
                } Credits?`,
              },
              buttonText: 'REDEEM',
              buttonCssClass: 'im-alert-confirm',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader())),
            switchMap(() =>
              this.voucher.redeemVoucher(EpVoucherQuery, {
                code: voucher.code,
                sellerId: voucher.seller.id,
              })
            ),
            tap(async () => {
              await this.status.dismissLoader();
              this.info.open({
                title: 'Redemption Successful',
                description: `Voucher ${voucher.code} has been moved to the Redeemed tab.`,
                icon: { name: '/assets/icons/im-applied-check.svg', source: 'src' },
                useBackground: false,
                buttonText: 'Return to My Vouchers',
              });
              this.user.transactions.dispatchers.refresh();
              this.user.credits.dispatchers.refresh();
            }),
            map((v) => {
              return EpVouchersActions.redeemVoucherSuccess({ voucher: v });
            })
          ),
        onError: (action, error) => {
          this.status.dismissLoader();
          this.status.presentNgRxActionAlert(action, error);
          return EpVouchersActions.redeemVoucherError({ error });
        },
      })
    )
  );

  readonly refundVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpVouchersActions.refundVoucher),
      pessimisticUpdate({
        run: ({ voucher: _voucher }) =>
          from(
            this.status.presentAlertWithAction({
              alertData: {
                title: 'Confirm',
                description: _voucher.dateRedeemed
                  ? `Are you sure you want to refund this voucher? This will debit ${
                      _voucher.amount / 100
                    } Credits from your account and will be sent back to @${
                      _voucher.changeMakerReceiver?.handle.id ||
                      _voucher.exchangePartnerReceiver?.handle.id ||
                      _voucher.servePartnerReceiver?.handle.id
                    }.`
                  : `Are you sure you want to refund this voucher?
                       Your current Credits will not be affected.`,
              },
              buttonText: 'REFUND',
              buttonCssClass: 'im-alert-deny',
            })
          ).pipe(
            filter((v) => v),
            delayWhen(() => from(this.status.showLoader('Refunding Voucher...'))),
            switchMap(() => this.voucher.refundVoucher(EpVoucherQuery, { voucherId: _voucher.id })),
            map((voucher) => {
              this.user.credits.dispatchers.refresh();
              this.user.transactions.dispatchers.refresh();
              this.info.open({
                title: 'Refund Successful',
                description: `Voucher ${voucher.code} has been moved to the Refunded tab.
                The cost of the voucher has been deducted from your Wallet and returned to the original
                purchaser.`,
                icon: { name: '/assets/icons/im-applied-check.svg', source: 'src' },
                useBackground: false,
                buttonText: 'Return to My Vouchers',
              });
              return EpVouchersActions.refundVoucherSuccess({ voucher });
            })
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpVouchersActions.redeemVoucherError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly archiveVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpVouchersActions.archiveVoucher),
      delayWhen(() => from(this.status.showLoader('Archiving Voucher...'))),
      pessimisticUpdate({
        run: ({ voucher: _voucher }) =>
          this.voucher.archiveVoucher(EpVoucherQuery, { voucherId: _voucher.id }).pipe(
            map((voucher) => {
              return EpVouchersActions.archiveVoucherSuccess({ voucher });
            })
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpVouchersActions.redeemVoucherError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  readonly unarchiveVoucher$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EpVouchersActions.unarchiveVoucher),
      delayWhen(() => from(this.status.showLoader('Unarchiving Voucher...'))),
      fetch({
        run: ({ voucher: _voucher }) =>
          this.voucher.unarchiveVoucher(EpVoucherQuery, { voucherId: _voucher.id }).pipe(
            map((voucher) => {
              return EpVouchersActions.unarchiveVoucherSuccess({ voucher });
            })
          ),
        onError: (action, error) => {
          this.status.presentNgRxActionAlert(action, error);
          return EpVouchersActions.redeemVoucherError({ error });
        },
      }),
      tap(() => this.status.dismissLoader())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly voucher: VoucherRestClient,
    private readonly user: UserFacade,
    private readonly status: StatusService,
    private readonly info: InfoModalService
  ) {}
}
