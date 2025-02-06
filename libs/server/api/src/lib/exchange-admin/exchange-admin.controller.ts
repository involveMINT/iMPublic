import { ExchangeAdminService } from '@involvemint/server/core/application-services';
import {
  AddExchangeAdminDto,
  BaDownloadEpAdminsQuery,
  EpAdminQuery,
  ExchangeAdmin,
  GetExchangeAdminsForExchangePartnerDto,
  GetSuperAdminForExchangePartnerDto,
  InvolvemintRoutes,
  RemoveExchangeAdminDto,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
} from '@involvemint/shared/domain';
import { 
  Controller,
  Post,
  Body,
  Headers
} from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.epAdmin)
export class ExchangeAdminController {
  constructor(private readonly epAdmin: ExchangeAdminService) {}

  @Post('getForExchangePartner')
  getForExchangePartner(
    @Body(QUERY_KEY, new QueryValidationPipe(EpAdminQuery)) query: Query<ExchangeAdmin>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: GetExchangeAdminsForExchangePartnerDto
  ) {
    return this.epAdmin.getForExchangePartner(query, token, dto);
  }

  @Post('getSuperAdminForExchangePartner')
  async getSuperAdminForExchangePartner(
    @Body(QUERY_KEY, new QueryValidationPipe(BaDownloadEpAdminsQuery)) query: Query<ExchangeAdmin>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: GetSuperAdminForExchangePartnerDto
  ) {
    return this.epAdmin.getSuperAdminForExchangePartner(query, token, dto);
  }

  @Post('addAdmin')
  addAdmin(
    @Body(QUERY_KEY, new QueryValidationPipe(EpAdminQuery)) query: Query<ExchangeAdmin>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: AddExchangeAdminDto
  ) {
    return this.epAdmin.addAdmin(query, token, dto);
  }

  @Post('removeAdmin')
  removeAdmin(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: true }>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: RemoveExchangeAdminDto
  ) {
    return this.epAdmin.removeAdmin(query, token, dto);
  }
}
