import { IOneToMany, IOneToOne } from '../repository';
import { Address } from '../address';
import { Credit } from '../credit';
import { ExchangeAdmin } from '../exchange-admin';
import { Handle } from '../handle';
import { Offer } from '../offer';
import { Request } from '../request';
import { Transaction } from '../transaction';
import { Voucher } from '../voucher';
import { ExchangePartnerView } from './exchange-partner.view';

export type StorefrontListingStatus = 'public' | 'unlisted' | 'private';
export const defaultStorefrontListingStatus: StorefrontListingStatus = 'public';

export const enum EpOnboardingState {
  profile = 'profile',
  none = 'none',
}

export interface ExchangePartner {
  id: string;
  name: string;
  description?: string;
  website: string;
  phone: string;
  email: string;
  ein: string;
  logoFilePath?: string;
  imagesFilePaths: string[];
  listStoreFront: StorefrontListingStatus;
  budgetEndDate: Date | string;
  budget: number;
  latitude?: number;
  longitude?: number;
  dateCreated: Date | string;
  onboardingState: EpOnboardingState;

  address: IOneToOne<Address, 'exchangePartner'>;
  handle: IOneToOne<Handle, 'exchangePartner'>;
  offers: IOneToMany<Offer, 'exchangePartner'>;
  requests: IOneToMany<Request, 'exchangePartner'>;
  admins: IOneToMany<ExchangeAdmin, 'exchangePartner'>;
  credits: IOneToMany<Credit, 'exchangePartner'>;
  sendingTransactions: IOneToMany<Transaction, 'senderExchangePartner'>;
  receivingTransactions: IOneToMany<Transaction, 'receiverExchangePartner'>;

  sendingVouchers: IOneToMany<Voucher, 'seller'>;
  receivingVouchers: IOneToMany<Voucher, 'exchangePartnerReceiver'>;

  view: IOneToOne<ExchangePartnerView, 'exchangePartner'>;
}
