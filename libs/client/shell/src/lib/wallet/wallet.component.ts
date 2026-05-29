import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  ActiveProfile,
  CreditStoreModel,
  ImHandleSearchModalService,
  ImHandleSearchModalType,
  ImVoucherModalService,
  SearchResult,
  TransactionStoreModel,
  UserFacade,
  VoucherStoreModel,
} from '@involvemint/client/shared/data-access';
import { ImTabsComponent } from '@involvemint/client/shared/ui';
import { StatefulComponent } from '@involvemint/client/shared/util';
import {
  calculateTransactionMetaData,
  calculateVoucherStatus,
  ImConfig,
  TransactionMetaData,
  VoucherStatus,
  WalletTabs,
} from '@involvemint/shared/domain';
import { parseDate } from '@involvemint/shared/util';
import { FormControl } from '@ngneat/reactive-forms';
import { compareDesc } from 'date-fns';
import { tap } from 'rxjs/operators';

interface TransactionWallet extends TransactionStoreModel {
  meta: TransactionMetaData;
}

interface State {
  credits: CreditStoreModel[];
  escrowCredits: CreditStoreModel[];
  receivedTransactions: TransactionWallet[];
  sentTransactions: TransactionWallet[];
  allTransactions: TransactionWallet[];
  creditsLoaded: boolean;
  transactionsLoaded: boolean;
  balance: number;
  escrowBalance: number;
  recipient: SearchResult | null;
  activeProfile: ActiveProfile | null;
  vouchers: VoucherStoreModel[];
  vouchersLoaded: boolean;
  /** Negative balance limit for the current profile (in display units, e.g., dollars) */
  negativeLimit: number;
  /** True if balance is negative */
  isNegative: boolean;
  /** True if balance has reached or exceeded the negative limit */
  isAtLimit: boolean;
}

@Component({
  selector: 'involvemint-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent extends StatefulComponent<State> implements OnInit {
  @Input() mobileView = false;

  @ViewChild('amountInp') amountInp!: ElementRef<HTMLInputElement>;
  @ViewChild('tabs') tabs!: ImTabsComponent;

  readonly amount = new FormControl<number>(0, (e) => Validators.required(e));
  readonly memo = new FormControl<string>('', (e) => Validators.required(e));

  constructor(
    private readonly user: UserFacade,
    private readonly handleSearch: ImHandleSearchModalService,
    private readonly voucherInfo: ImVoucherModalService
  ) {
    super({
      credits: [],
      escrowCredits: [],
      receivedTransactions: [],
      sentTransactions: [],
      allTransactions: [],
      creditsLoaded: false,
      transactionsLoaded: false,
      balance: 0,
      escrowBalance: 0,
      recipient: null,
      activeProfile: null,
      vouchers: [],
      vouchersLoaded: false,
      negativeLimit: ImConfig.negativeBalanceLimit.changeMaker / 100, // Default to CM limit
      isNegative: false,
      isAtLimit: false,
    });
  }

  ngOnInit() {
    this.effect(() =>
      this.user.credits.selectors.credits$.pipe(
        tap(({ credits, loaded, escrowCredits }) => {
          let balance = 0;
          let escrowBalance = 0;
          credits.forEach((credit) => (balance += credit.amount));
          escrowCredits.forEach((escrowCredit) => (escrowBalance += escrowCredit.amount));
          const balanceInDisplayUnits = balance / 100;
          const isNegative = balanceInDisplayUnits < 0;
          const isAtLimit = balanceInDisplayUnits <= -this.state.negativeLimit;
          this.updateState({
            credits,
            creditsLoaded: loaded,
            balance: balanceInDisplayUnits,
            escrowCredits,
            escrowBalance,
            isNegative,
            isAtLimit,
          });
        })
      )
    );

    this.effect(() =>
      this.user.transactions.selectors.transactions$.pipe(
        tap(({ receivedTransactions, sentTransactions, loaded }) => {
          const received = receivedTransactions.map((r) => ({
            ...r,
            meta: calculateTransactionMetaData(r),
          }));
          const sent = sentTransactions.map((s) => ({ ...s, meta: calculateTransactionMetaData(s) }));
          this.updateState({
            receivedTransactions: received,
            sentTransactions: sent,
            transactionsLoaded: loaded,
            allTransactions: [...received, ...sent].sort((a, b) =>
              compareDesc(parseDate(a.dateTransacted), parseDate(b.dateTransacted))
            ),
          });
        })
      )
    );

    this.effect(() =>
      this.user.session.selectors.activeProfile$.pipe(
        tap((activeProfile) => {
          // Determine the negative balance limit based on profile type
          let negativeLimit = ImConfig.negativeBalanceLimit.changeMaker / 100;
          if (activeProfile) {
            switch (activeProfile.type) {
              case 'cm':
                negativeLimit = ImConfig.negativeBalanceLimit.changeMaker / 100;
                break;
              case 'ep':
                negativeLimit = ImConfig.negativeBalanceLimit.exchangePartner / 100;
                break;
              case 'sp':
                negativeLimit = ImConfig.negativeBalanceLimit.servePartner / 100;
                break;
            }
          }
          // Recalculate isAtLimit with the new negativeLimit
          const isAtLimit = this.state.balance <= -negativeLimit;
          this.updateState({ activeProfile, negativeLimit, isAtLimit });
        })
      )
    );

    this.effect(() =>
      this.user.session.actionListeners.setWalletTab$.pipe(tap(({ tab }) => this.tabs.setIndex(tab)))
    );

    this.effect(() =>
      this.amount.valueChanges.pipe(
        tap((amount) => {
          if (!amount) {
            this.amount.patchValue(0, { emitEvent: false });
          }
        })
      )
    );

    this.effect(() =>
      this.user.session.actionListeners.payTo$.pipe(
        tap(({ handleId, amount }) => {
          this.updateState({ recipient: { id: handleId } as SearchResult });
          this.tabs.setIndex(WalletTabs.send);
          this.memo.patchValue('Storefront Purchase');
          if (amount) {
            this.amount.patchValue(amount / 100);
          }
        })
      )
    );

    this.effect(() =>
      this.user.transactions.actionListeners.transaction.success.pipe(
        tap(() => {
          this.amount.reset();
        })
      )
    );
  }

  tabChangeEvent(event: number) {
    if (typeof event !== 'number') {
      return;
    }

    if (event === 2) {
      this.effect(() =>
        this.user.vouchers.selectors.vouchers$.pipe(
          tap(({ vouchers, loaded }) => {
            this.updateState({
              vouchers: vouchers.sort((a, b) =>
                compareDesc(parseDate(a.dateCreated), parseDate(b.dateCreated))
              ),
              vouchersLoaded: loaded,
            });
          })
        )
      );
    }
  }

  refresh() {
    this.user.credits.dispatchers.refresh();
  }

  focus() {
    this.amountInp.nativeElement.focus();
  }

  async openProfileSearchModal() {
    const res = await this.handleSearch.open(ImHandleSearchModalType.handle, { title: 'Send to...' });
    if (res) {
      this.updateState({ recipient: res });
    }
  }

  transaction(recipientHandle: string) {
    this.user.transactions.dispatchers.transaction({
      amount: Number((this.amount.value * 100).toFixed(2)),
      memo: this.memo.value,
      receiverHandle: recipientHandle,
    });
  }

  calculateVoucherStatus(voucher: VoucherStoreModel) {
    return calculateVoucherStatus(voucher);
  }

  openVoucher(voucher: VoucherStoreModel) {
    return this.voucherInfo.open({ voucher });
  }

  voucherIsActive(voucher: VoucherStoreModel) {
    return calculateVoucherStatus(voucher) === VoucherStatus.active;
  }

  getRunningTotal(state: State, index: number) {
    let run = state.balance;
    for (let i = 0; i < index; i++) {
      const transaction = state.allTransactions[i];
      const wasSent = state.activeProfile?.handle?.id === transaction.meta.senderHandle;
      run += (wasSent ? transaction.amount : -transaction.amount) / 100;
    }
    return run;
  }
}
