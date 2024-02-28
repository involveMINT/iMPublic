import { TransactionService } from '@involvemint/server/core/application-services';
import {
  GetTransactionsForProfileDto,
  Transaction,
  TransactionDto,
  TransactionQuery,
  InvolvemintRoutes,
  IQuery,
  QUERY_KEY,
  TOKEN_KEY,
  DTO_KEY
} from '@involvemint/shared/domain';
import { Controller, Post, Body } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.transaction)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('getForProfile')
  getForProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(TransactionQuery)) query: IQuery<Transaction>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetTransactionsForProfileDto
  ) {
    return this.transactionService.getForProfile(query, token, dto);
  }

  @Post('transaction')
  transaction(
    @Body(QUERY_KEY, new QueryValidationPipe(TransactionQuery)) query: IQuery<Transaction>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: TransactionDto
  ) {
    return this.transactionService.transactionP2p(query, token, dto, true);
  }
}
