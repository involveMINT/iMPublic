import { HandleService } from '@involvemint/server/core/application-services';
import {
  GenericHandleSearchDto,
  GenericHandleSearchQuery,
  Handle,
  HandleChatQuery,
  InvolvemintRoutes,
  SearchHandleDto,
  VerifyHandleDto,
  VerifyHandleQuery,
  ViewProfileDto,
  ViewProfileInfoQuery,
  Query,
  DTO_KEY,
  QUERY_KEY,
  parseQuery,
} from '@involvemint/shared/domain';
import { Controller, Post, Body } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.handle)
export class HandleController {
  constructor(private readonly handle: HandleService) {}

  @Post('verifyHandle')
  async verifyHandle(
    @Body(QUERY_KEY, new QueryValidationPipe(VerifyHandleQuery)) query: Query<{ isUnique: boolean }>, 
    @Body(DTO_KEY, new ValidationPipe()) { handle }: VerifyHandleDto
  ) {
    const isUnique = await this.handle.verifyHandle(handle);
    return parseQuery(query, { isUnique });
  }

  @Post('searchHandles')
  async searchHandles(
    @Body(QUERY_KEY, new QueryValidationPipe(HandleChatQuery)) query: Query<Handle[]>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SearchHandleDto
  ) {
    return this.handle.searchHandles(query, dto);
  }

  @Post('viewProfile')
  async viewProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(ViewProfileInfoQuery)) query: Query<Handle[]>,
    @Body(DTO_KEY, new ValidationPipe()) dto: ViewProfileDto
  ) {
    return this.handle.viewProfile(query, dto);
  }

  @Post('genericSearch')
  async genericSearch(
    @Body(QUERY_KEY, new QueryValidationPipe(GenericHandleSearchQuery)) query: Query<Handle[]>,
    @Body(DTO_KEY, new ValidationPipe()) dto: GenericHandleSearchDto
  ) {
    return this.handle.genericSearch(query, dto);
  }
}
