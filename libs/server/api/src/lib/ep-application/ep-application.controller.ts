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
  TOKEN_KEY,
  Query,
  DTO_KEY,
  QUERY_KEY
} from '@involvemint/shared/domain';
import { 
  Controller,
  Post,
  Body,
  Headers
} from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.epApplication)
export class EpApplicationController {
  constructor(private readonly epApp: EpApplicationService) {}

  @Post('submit')
  submit(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.epApplications)) query: Query<EpApplication>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SubmitEpApplicationDto
  ) {
    return this.epApp.submit(query, token, dto);
  }

  @Post('withdraw')
  withdraw(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: WithdrawEpApplicationDto
  ) {
    return this.epApp.withdraw(query, token, dto);
  }

  @Post('baSubmit')
  baSubmit(
    @Body(QUERY_KEY, new QueryValidationPipe(BaSubmitEpApplicationQuery)) query: Query<ExchangePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: BaSubmitEpApplicationDto
  ) {
    return this.epApp.baSubmit(query, token, dto);
  }

  @Post('process')
  process(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ProcessEpApplicationDto
  ) {
    return this.epApp.process(query, token, dto);
  }

  @Post('findAll')
  findAll(
    @Body(QUERY_KEY, new QueryValidationPipe(EpApplicationQuery)) query: Query<EpApplication>, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.epApp.findAll(query, token);
  }
}
