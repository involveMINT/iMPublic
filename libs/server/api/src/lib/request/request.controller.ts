import { RequestService } from '@involvemint/server/core/application-services';
import {
  CreateRequestDto,
  DeleteRequestDto,
  DeleteRequestImageDto,
  GetOneRequestDto,
  GetRequestsForProfileDto,
  InvolvemintRoutes,
  QueryRequestsDto,
  Request,
  RequestMarketQuery,
  RequestQuery,
  UpdateRequestDto,
  UploadRequestImageDto,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  FILES_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, UploadedFiles, UseInterceptors,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller(InvolvemintRoutes.request)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('query')
  query(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestMarketQuery)) query: Query<Request[]>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: QueryRequestsDto
  ) {
    return this.requestService.query(query, dto);
  }

  @Post('getOne')
  getOne(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestQuery)) query: Query<Request>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetOneRequestDto
  ) {
    return this.requestService.getOne(query, dto);
  }

  @Post('getForProfile')
  getForProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestQuery)) query: Query<Request[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetRequestsForProfileDto
  ) {
    return this.requestService.getForProfile(query, token, dto);
  }

  @Post('create')
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestQuery)) query: Query<Request>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: CreateRequestDto
  ) {
    return this.requestService.create(query, token, dto);
  }

  @Post('update')
  update(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestQuery)) query: Query<Request>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UpdateRequestDto
  ) {
    return this.requestService.update(query, token, dto);
  }

  @Post('delete')
  delete(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteRequestDto
  ) {
    return this.requestService.delete(query, token, dto);
  }

  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  uploadImages(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestQuery)) query: Query<Request>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UploadRequestImageDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.requestService.uploadImages(query, token, dto, files);
  }

  @Post('deleteImage')
  deleteImage(
    @Body(QUERY_KEY, new QueryValidationPipe(RequestQuery)) query: Query<Request>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteRequestImageDto
  ) {
    return this.requestService.deleteImage(query, token, dto);
  }
}
