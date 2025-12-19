import { IManyToOne } from '../repository';
import { ChangeMaker } from '../change-maker';
import { ExchangePartner } from '../exchange-partner';
import { ServePartner } from '../serve-partner';

export interface Transaction {
  id: string;
  dateTransacted: Date | string;
  amount: number;
  memo: string;
  epAudibleCode?: string;

  // credits: IOneToMany<Transaction, Credit>;

  // Possible senders:
  senderChangeMaker?: IManyToOne<ChangeMaker, 'sendingTransactions'>;
  senderServePartner?: IManyToOne<ServePartner, 'sendingTransactions'>;
  senderExchangePartner?: IManyToOne<ExchangePartner, 'sendingTransactions'>;

  // Possible receivers:
  receiverChangeMaker?: IManyToOne<ChangeMaker, 'receivingTransactions'>;
  receiverServePartner?: IManyToOne<ServePartner, 'receivingTransactions'>;
  receiverExchangePartner?: IManyToOne<ExchangePartner, 'receivingTransactions'>;
}
