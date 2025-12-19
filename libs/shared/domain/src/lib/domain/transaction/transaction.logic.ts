import { createLogic } from '../repository';
import { Transaction } from './transaction.model';

export interface TransactionMetaData {
  senderHandle: string;
  receiverHandle: string;
}

export const calculateTransactionMetaData = createLogic<
  Transaction,
  {
    receiverChangeMaker: {
      id: true;
      handle: { id: true };
    };
    receiverExchangePartner: {
      id: true;
      handle: { id: true };
    };
    receiverServePartner: {
      id: true;
      handle: { id: true };
    };
    senderChangeMaker: {
      id: true;
      handle: { id: true };
    };
    senderExchangePartner: {
      id: true;
      handle: { id: true };
    };
    senderServePartner: {
      id: true;
      handle: { id: true };
    };
  }
>()((transaction) => {
  let senderHandle = '';
  let receiverHandle = '';

  if (transaction.receiverChangeMaker) {
    receiverHandle = transaction.receiverChangeMaker.handle.id;
  }
  if (transaction.receiverExchangePartner) {
    receiverHandle = transaction.receiverExchangePartner.handle.id;
  }
  if (transaction.receiverServePartner) {
    receiverHandle = transaction.receiverServePartner.handle.id;
  }
  if (transaction.senderChangeMaker) {
    senderHandle = transaction.senderChangeMaker.handle.id;
  }
  if (transaction.senderExchangePartner) {
    senderHandle = transaction.senderExchangePartner.handle.id;
  }
  if (transaction.senderServePartner) {
    senderHandle = transaction.senderServePartner.handle.id;
  }

  return {
    receiverHandle,
    senderHandle,
  };
});
