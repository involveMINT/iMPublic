import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StatefulComponent } from '@involvemint/client/shared/util';
import { calculateVoucherExpirationDate } from '@involvemint/shared/domain';
import { UnArray } from '@involvemint/shared/util';
import { ModalController } from '@ionic/angular';
import { ExchangePartnerMarketStoreModel } from '../../market/market.reducer';
import { ActiveProfile } from '../../session/user-session.reducer';
import { UserFacade } from '../../user.facade';
import { VoucherStoreModel } from '../vouchers.reducer';

export interface ConfirmVoucherPurchaseModalInputs {
  seller: ExchangePartnerMarketStoreModel;
  offers: Array<{ offer: UnArray<ExchangePartnerMarketStoreModel['offers']>; quantity: number }>;
  selectedProfile: ActiveProfile;
}

interface State {
  voucher: VoucherStoreModel | null;
}

@Component({
  selector: 'im-confirm-voucher-purchase-modal',
  templateUrl: './confirm-voucher-purchase-modal.component.html',
  styleUrls: ['./confirm-voucher-purchase-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmVoucherPurchaseModalComponent
  extends StatefulComponent<State>
  implements OnInit, ConfirmVoucherPurchaseModalInputs
{
  readonly seller!: ExchangePartnerMarketStoreModel;
  readonly offers!: Array<{ offer: UnArray<ExchangePartnerMarketStoreModel['offers']>; quantity: number }>;
  readonly selectedProfile!: ActiveProfile;

  constructor(private readonly modal: ModalController, private readonly user: UserFacade) {
    super({ voucher: null });
  }

  ngOnInit() {
    let amount = 0;
    this.offers.forEach((o) => (amount += o.offer.price * o.quantity));
    this.updateState({
      voucher: {
        dateCreated: new Date(),
        amount,
        id: '',
        code: '',
        changeMakerReceiver: this.selectedProfile as any, // TODO Better way to do this
        offers: this.offers.map((o) => ({
          id: '',
          quantity: o.quantity,
          offer: o.offer,
        })),
        seller: this.seller,
        dateArchived: undefined,
        dateExpires: calculateVoucherExpirationDate(new Date()),
        dateRedeemed: undefined,
        dateRefunded: undefined,
        exchangePartnerReceiver: undefined,
        servePartnerReceiver: undefined,
      },
    });
  }

  close() {
    this.modal.dismiss();
  }

  purchase() {
    this.modal.dismiss(true);
  }
}
