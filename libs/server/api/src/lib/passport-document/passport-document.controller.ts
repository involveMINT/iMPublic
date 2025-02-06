import { PassportService } from '@involvemint/server/core/application-services';
import {
  DeletePassportDocumentDto,
  DeletePassportDocumentQuery,
  EditPassportDocumentDto,
  InvolvemintRoutes,
  PassportDocument,
  PassportDocumentQuery,
  ReplacePassportDocumentDto,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  FILES_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, UploadedFile, UseInterceptors,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(InvolvemintRoutes.passport)
export class PassportDocumentController {
  constructor(private readonly passport: PassportService) {}

  @Post('get')
  get(
    @Body(QUERY_KEY, new QueryValidationPipe(PassportDocumentQuery)) query: Query<PassportDocument[]>, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.passport.get(query, token);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor(FILES_KEY))
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(PassportDocumentQuery)) query: Query<PassportDocument>, 
    @Headers(TOKEN_KEY) token: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.passport.create(query, token, file);
  }

  @Post('edit')
  edit(
    @Body(QUERY_KEY, new QueryValidationPipe(PassportDocumentQuery)) query: Query<PassportDocument>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: EditPassportDocumentDto
  ) {
    return this.passport.edit(query, token, dto);
  }

  @Post('replace')
  @UseInterceptors(FileInterceptor(FILES_KEY))
  replace(
    @Body(QUERY_KEY, new QueryValidationPipe(PassportDocumentQuery)) query: Query<PassportDocument>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ReplacePassportDocumentDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.passport.replace(query, token, dto, file);
  }

  @Post('delete')
  delete(
    @Body(QUERY_KEY, new QueryValidationPipe(DeletePassportDocumentQuery)) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeletePassportDocumentDto
  ) {
    return this.passport.delete(query, token, dto);
  }
}
