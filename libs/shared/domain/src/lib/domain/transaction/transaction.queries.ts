import { createQuery } from '../repository';
import { Transaction } from './transaction.model';

export const TransactionQuery = createQuery<Transaction>()({
  id: true,
  amount: true,
  dateTransacted: true,
  memo: true,
  epAudibleCode: true,
  receiverChangeMaker: {
    id: true,
    handle: { id: true },
  },
  receiverExchangePartner: {
    id: true,
    handle: { id: true },
  },
  receiverServePartner: {
    id: true,
    handle: { id: true },
  },
  senderChangeMaker: {
    id: true,
    handle: { id: true },
  },
  senderExchangePartner: {
    id: true,
    handle: { id: true },
  },
  senderServePartner: {
    id: true,
    handle: { id: true },
  },
});
