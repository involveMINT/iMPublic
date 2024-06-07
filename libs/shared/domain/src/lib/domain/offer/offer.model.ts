import { IManyToOne, IOneToMany, IOneToOne } from '../repository';
import { Address } from '../address';
import { ChangeMaker } from '../change-maker';
import { ExchangePartner } from '../exchange-partner';
import { LinkedVoucherOffer } from '../linked-voucher-offers';
import { ServePartner } from '../serve-partner';

export type OfferListingStatus = 'public' | 'unlisted' | 'private';
export const defaultOfferListingStatus: OfferListingStatus = 'private';

export interface Offer {
  id: string;
  listingStatus: OfferListingStatus;
  name: string;
  description: string;
  price: number;
  imagesFilePaths: string[];
  dateUpdated: Date | string;
  dateCreated: Date | string;

  address?: IOneToOne<Address, 'offer'>;
  changeMaker?: IManyToOne<ChangeMaker, 'offers'>;
  exchangePartner?: IManyToOne<ExchangePartner, 'offers'>;
  servePartner?: IManyToOne<ServePartner, 'offers'>;
  vouchers?: IOneToMany<LinkedVoucherOffer, 'offer'>;
}
