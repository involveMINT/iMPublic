import { EpApplicationService } from '@involvemint/server/core/application-services';
import {
  BaSubmitEpApplicationDto,
  BaSubmitEpApplicationQuery,
  EpApplication,
  EpApplicationQuery,
  ExchangePartner,
  InvolvemintRoutes,
  ProcessEpApplicationDto,
  SubmitEpApplicationDto,
  UserQuery,
  WithdrawEpApplicationDto,
  IQuery,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
} from '@involvemint/shared/domain';
import { 
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.epApplication)
export class EpApplicationController {
  constructor(private readonly epApp: EpApplicationService) {}

  @Post('submit')
  submit(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.epApplications)) query: IQuery<EpApplication>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SubmitEpApplicationDto
  ) {
    return this.epApp.submit(query, token, dto);
  }

  @Post('withdraw')
  withdraw(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: IQuery<{ deletedId: string }>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: WithdrawEpApplicationDto
  ) {
    return this.epApp.withdraw(query, token, dto);
  }

  @Post('baSubmit')
  baSubmit(
    @Body(QUERY_KEY, new QueryValidationPipe(BaSubmitEpApplicationQuery)) query: IQuery<ExchangePartner>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: BaSubmitEpApplicationDto
  ) {
    return this.epApp.baSubmit(query, token, dto);
  }

  @Post('process')
  process(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: IQuery<{ deletedId: string }>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ProcessEpApplicationDto
  ) {
    return this.epApp.process(query, token, dto);
  }

  @Post('findAll')
  findAll(
    @Body(QUERY_KEY, new QueryValidationPipe(EpApplicationQuery)) query: IQuery<EpApplication>, 
    @Body(TOKEN_KEY) token: string
  ) {
    return this.epApp.findAll(query, token);
  }
}
