import { TransactionService } from '@involvemint/server/core/application-services';
import {
  GetTransactionsForProfileDto,
  InvolvemintOrchestrations,
  ITransactionOrchestration,
  Transaction,
  TransactionDto,
  TransactionQuery,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.transaction)
export class TransactionOrchestration implements IServerOrchestration<ITransactionOrchestration> {
  constructor(private readonly transactionService: TransactionService) {}
  @ServerOperation({ validateQuery: TransactionQuery })
  getForProfile(query: IQuery<Transaction>, token: string, dto: GetTransactionsForProfileDto) {
    return this.transactionService.getForProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: TransactionQuery })
  transaction(query: IQuery<Transaction>, token: string, dto: TransactionDto) {
    return this.transactionService.transactionP2p(query, token, dto, true);
  }
}
