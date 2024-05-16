import { ServeAdminService } from '@involvemint/server/core/application-services';
import {
  AddServeAdminDto,
  GetServeAdminsForServePartnerDto,
  InvolvemintRoutes,
  RemoveServeAdminDto,
  ServeAdmin,
  SpAdminQuery,
  IQuery,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.spAdmin)
export class ServeAdminController {
  constructor(private readonly serveAdminService: ServeAdminService) {}

  @Post('getForServePartner')
  getForServePartner(
    @Body(QUERY_KEY, new QueryValidationPipe(SpAdminQuery)) query: IQuery<ServeAdmin>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetServeAdminsForServePartnerDto
  ) {
    return this.serveAdminService.getForServePartner(query, token, dto);
  }

  @Post('addAdmin')
  addAdmin(
    @Body(QUERY_KEY, new QueryValidationPipe(SpAdminQuery)) query: IQuery<ServeAdmin>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: AddServeAdminDto
  ) {
    return this.serveAdminService.addAdmin(query, token, dto);
  }

  @Post('removeAdmin')
  removeAdmin(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: IQuery<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: RemoveServeAdminDto
  ) {
    return this.serveAdminService.removeAdmin(query, token, dto);
  }
}
