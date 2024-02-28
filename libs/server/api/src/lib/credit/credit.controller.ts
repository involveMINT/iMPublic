import { CreditService } from '@involvemint/server/core/application-services';
import {
  Credit,
  CreditQuery,
  GetCreditsForProfileDto,
  InvolvemintRoutes,
  MintDto,
  IQuery,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
} from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body
  } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.credit)
export class CreditController {
    constructor(private readonly credit: CreditService) {}

  @Post('getCreditsForProfile')
  getCreditsForProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(CreditQuery)) query: IQuery<Credit>, 
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetCreditsForProfileDto
  ) {
    return this.credit.getCreditsForProfile(query, token, dto);
  }

  @Post('mint')
  mint(
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: MintDto
  ) {
    return this.credit.mint(token, dto);
  }
}
