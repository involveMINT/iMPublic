import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EpVoucherStoreModel, ExchangePartnerFacade } from '@involvemint/client/ep/data-access';
import { VoucherStoreModel } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculateVoucherStatus, VoucherStatus } from '@involvemint/shared/domain';
import { tap } from 'rxjs/operators';

interface State {
  active: EpVoucherStoreModel[];
  redeemed: EpVoucherStoreModel[];
  archived: EpVoucherStoreModel[];
  refunded: EpVoucherStoreModel[];
  expired: EpVoucherStoreModel[];
  loaded: boolean;
}

@Component({
  selector: 'involvemint-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VouchersComponent extends StatefulComponent<State> implements OnInit {
  constructor(private readonly epf: ExchangePartnerFacade, private readonly route: RouteService) {
    super({ active: [], redeemed: [], archived: [], refunded: [], expired: [], loaded: false });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.epf.epVouchers.selectors.vouchers$.pipe(
        tap(({ vouchers, loaded }) =>
          this.updateState({
            loaded: loaded,
            active: vouchers.filter(
              (v) => calculateVoucherStatus(v) === VoucherStatus.active && !v.dateArchived
            ),
            redeemed: vouchers.filter(
              (v) => calculateVoucherStatus(v) === VoucherStatus.redeemed && !v.dateArchived
            ),
            refunded: vouchers.filter(
              (v) => calculateVoucherStatus(v) === VoucherStatus.refunded && !v.dateArchived
            ),
            expired: vouchers.filter(
              (v) => calculateVoucherStatus(v) === VoucherStatus.expired && !v.dateArchived
            ),
            archived: vouchers.filter((v) => v.dateArchived),
          })
        )
      )
    );
  }

  refresh() {
    this.epf.epVouchers.dispatchers.refresh();
  }

  viewVoucher(voucher: EpVoucherStoreModel) {
    this.route.to.ep.vouchers.VOUCHER(voucher.id);
  }

  calculateVoucherStatus(voucher: EpVoucherStoreModel) {
    return calculateVoucherStatus(voucher);
  }

  getVoucherOwnerHandle(voucher: EpVoucherStoreModel) {
    return voucher.changeMakerReceiver
      ? voucher.changeMakerReceiver.handle.id
      : voucher.exchangePartnerReceiver
      ? voucher.exchangePartnerReceiver.handle.id
      : voucher.servePartnerReceiver
      ? voucher.servePartnerReceiver.handle.id
      : undefined;
  }

  voucherIsActive(voucher: VoucherStoreModel) {
    return calculateVoucherStatus(voucher) === VoucherStatus.active;
  }
}
