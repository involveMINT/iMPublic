import { IOperation } from '@orcha/common';
import { GetTransactionsForProfileDto, TransactionDto } from './transaction.dto';
import { Transaction } from './transaction.model';

export interface ITransactionOrchestration {
  getForProfile: IOperation<Transaction[], GetTransactionsForProfileDto>;
  transaction: IOperation<Transaction, TransactionDto>;
}
