import { StorageService } from '@involvemint/server/core/application-services';
import {
  GetStorageFileDto,
  InvolvemintRoutes,
  Query,
  parseQuery,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.storage)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('getUrl')
  async getUrl(
    @Body(QUERY_KEY, new QueryValidationPipe({ url: true })) query: Query<{ url: string }>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: GetStorageFileDto,
  ) {
    const url = await this.storageService.authenticateFileRequest(dto.path, token);
    return parseQuery(query, { url });
  }
}
