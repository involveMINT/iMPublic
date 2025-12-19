import { IManyToOne, IOneToMany } from '../repository';
import { ChangeMaker } from '../change-maker';
import { ExchangePartner } from '../exchange-partner';
import { LinkedVoucherOffer } from '../linked-voucher-offers';
import { ServePartner } from '../serve-partner';

export interface Voucher {
  id: string;
  code: string;
  amount: number;
  dateCreated: Date | string;
  dateExpires?: Date | string;
  dateRefunded?: Date | string;
  dateRedeemed?: Date | string;
  dateArchived?: Date | string;

  seller: IManyToOne<ExchangePartner, 'sendingVouchers'>;
  offers: IOneToMany<LinkedVoucherOffer, 'voucher'>;

  // Possible owners:
  changeMakerReceiver?: IManyToOne<ChangeMaker, 'receivingVouchers'>;
  servePartnerReceiver?: IManyToOne<ServePartner, 'receivingVouchers'>;
  exchangePartnerReceiver?: IManyToOne<ExchangePartner, 'receivingVouchers'>;
}
