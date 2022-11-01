import { IOneToOne } from '@orcha/common';
import { ExchangePartner } from './exchange-partner.model';

export interface ExchangePartnerView {
  receivedThisMonth: number;

  exchangePartner: IOneToOne<ExchangePartner, 'view'>;
}
