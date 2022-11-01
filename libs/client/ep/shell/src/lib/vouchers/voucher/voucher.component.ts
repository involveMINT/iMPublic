import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EpVoucherStoreModel, ExchangePartnerFacade } from '@involvemint/client/ep/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import {
  calculateVoucherStatus,
  voucherCanBeRedeemed,
  voucherCanBeRefunded,
  VoucherStatus,
} from '@involvemint/shared/domain';
import { tap } from 'rxjs/operators';

interface State {
  voucher: EpVoucherStoreModel | null;
  status: VoucherStatus | null;
  voucherCanBeRefunded: boolean;
  voucherCanBeRedeemed: boolean;
}

@Component({
  selector: 'involvemint-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoucherComponent extends StatefulComponent<State> implements OnInit {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly route: RouteService,
    private readonly epf: ExchangePartnerFacade
  ) {
    super({ voucher: null, status: null, voucherCanBeRedeemed: false, voucherCanBeRefunded: false });
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.back();
      return;
    }

    this.effect(() =>
      this.epf.epVouchers.selectors.getVoucher(id).pipe(
        tap(({ voucher }) => {
          if (!voucher) {
            return;
          }
          this.updateState({
            voucher: voucher,
            status: calculateVoucherStatus(voucher),
            voucherCanBeRedeemed: voucherCanBeRedeemed(voucher),
            voucherCanBeRefunded: voucherCanBeRefunded(voucher),
          });
        })
      )
    );
  }

  back() {
    return this.route.back(() => this.route.to.ep.vouchers.ROOT({ animation: 'back' }));
  }

  async redeem(voucher: EpVoucherStoreModel) {
    this.epf.epVouchers.dispatchers.redeemVoucher(voucher);
  }

  refund(voucher: EpVoucherStoreModel) {
    this.epf.epVouchers.dispatchers.refundVoucher(voucher);
  }

  archive(voucher: EpVoucherStoreModel) {
    this.epf.epVouchers.dispatchers.archiveVoucher(voucher);
  }

  unarchive(voucher: EpVoucherStoreModel) {
    this.epf.epVouchers.dispatchers.unarchiveVoucher(voucher);
  }
}
