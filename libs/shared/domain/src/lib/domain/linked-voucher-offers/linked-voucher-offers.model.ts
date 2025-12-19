import { IManyToOne } from '../repository';
import { Offer } from '../offer';
import { Voucher } from '../voucher';

export interface LinkedVoucherOffer {
  id: string;
  quantity: number;

  voucher: IManyToOne<Voucher, 'offers'>;
  offer: IManyToOne<Offer, 'vouchers'>;
}
