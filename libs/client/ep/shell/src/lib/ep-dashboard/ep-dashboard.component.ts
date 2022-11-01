import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { EpVoucherStoreModel, ExchangePartnerFacade } from '@involvemint/client/ep/data-access';
import { TransactionStoreModel, UserFacade, UserStoreModel } from '@involvemint/client/shared/data-access';
import { RouteService } from '@involvemint/client/shared/routes';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculateVoucherStatus, VoucherStatus } from '@involvemint/shared/domain';
import { parseDate, UnArray } from '@involvemint/shared/util';
import { FormControl } from '@ngneat/reactive-forms';
import { compareDesc } from 'date-fns';
import { tap } from 'rxjs/operators';

type Profile = NonNullable<UnArray<UserStoreModel['exchangeAdmins']>['exchangePartner']>;

interface State {
  profile: Profile | null;
  receivedTransactions: TransactionStoreModel[];
  receivedTransactionsLoaded: boolean;
  unredeemedVouchers: EpVoucherStoreModel[];
  unredeemedVouchersLoaded: boolean;
}

@Component({
  selector: 'involvemint-ep-dashboard',
  templateUrl: './ep-dashboard.component.html',
  styleUrls: ['./ep-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpDashboardComponent extends StatefulComponent<State> implements OnInit {
  readonly budget = new FormControl<number>(0, (e) => Validators.required(e));

  @ViewChild('budgetInp') budgetInp!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly user: UserFacade,
    private readonly ep: ExchangePartnerFacade,
    private readonly route: RouteService
  ) {
    super({
      profile: null,
      receivedTransactions: [],
      unredeemedVouchers: [],
      unredeemedVouchersLoaded: false,
      receivedTransactionsLoaded: false,
    });
  }

  ngOnInit(): void {
    this.effect(() =>
      this.user.session.selectors.activeProfileEp$.pipe(
        tap((profile) => {
          this.budget.patchValue(profile.budget / 100, { emitEvent: false });
          this.updateState({ profile });
        })
      )
    );

    this.effect(() =>
      this.user.transactions.selectors.transactions$.pipe(
        tap(({ receivedTransactions, loaded }) =>
          this.updateState({
            receivedTransactions: receivedTransactions
              .sort((a, b) => compareDesc(parseDate(a.dateTransacted), parseDate(b.dateTransacted)))
              .slice(0, 5),
            receivedTransactionsLoaded: loaded,
          })
        )
      )
    );

    this.effect(() =>
      this.ep.epVouchers.selectors.vouchers$.pipe(
        tap(({ vouchers, loaded }) =>
          this.updateState({
            unredeemedVouchers: vouchers
              .filter((v) => calculateVoucherStatus(v) === VoucherStatus.active)
              .sort((a, b) => compareDesc(parseDate(a.dateCreated), parseDate(b.dateCreated)))
              .slice(0, 5),
            unredeemedVouchersLoaded: loaded,
          })
        )
      )
    );
  }

  edit() {
    this.budgetInp.nativeElement.focus();
  }

  payments() {
    this.user.session.dispatchers.toggleWallet(true);
  }

  gotoBudget() {
    this.route.to.ep.budget.ROOT();
  }

  vouchers() {
    this.route.to.ep.vouchers.ROOT();
  }

  viewVoucher(voucher: EpVoucherStoreModel) {
    this.route.to.ep.vouchers.VOUCHER(voucher.id);
  }
}
