import { SpApplicationService } from '@involvemint/server/core/application-services';
import {
  InvolvemintRoutes,
  ProcessSpApplicationDto,
  SpApplication,
  SpApplicationQuery,
  SubmitSpApplicationDto,
  UserQuery,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  WithdrawSpApplicationDto,
} from '@involvemint/shared/domain';
import { Controller, Post, Body,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.spApplication)
export class SpApplicationController {
  constructor(private readonly spApplicationService: SpApplicationService) {}

  @Post('submit')
  async submit(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.spApplications)) query: Query<SpApplication>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SubmitSpApplicationDto,
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.spApplicationService.submit(query, dto, token);
  }

  @Post('withdraw')
  async withdraw(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: WithdrawSpApplicationDto, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.spApplicationService.withdraw(query, token, dto);
  }

  @Post('process')
  async process(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ProcessSpApplicationDto, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.spApplicationService.process(query, dto, token);
  }

  @Post('findAll')
  async findAll(
    @Body(QUERY_KEY, new QueryValidationPipe(SpApplicationQuery)) query: Query<SpApplication>, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.spApplicationService.findAll(query, token);
  }
}
