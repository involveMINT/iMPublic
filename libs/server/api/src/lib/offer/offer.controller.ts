import { OfferService } from '@involvemint/server/core/application-services';
import {
  CreateOfferDto,
  DeleteOfferDto,
  DeleteOfferImageDto,
  GetOffersForProfileDto,
  GetOneOfferDto,
  InvolvemintRoutes,
  Offer,
  OfferMarketQuery,
  OfferQuery,
  QueryOffersDto,
  UpdateOfferDto,
  UploadOfferImageDto,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  FILES_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, UploadedFiles, UseInterceptors, Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller(InvolvemintRoutes.offer)
export class OfferController {
  constructor(private readonly offer: OfferService) {}

  @Post('query')
  query(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferMarketQuery)) query: Query<Offer[]>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: QueryOffersDto
  ) {
    return this.offer.query(query, dto);
  }

  @Post('getOne')
  getOne(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferMarketQuery)) query: Query<Offer>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetOneOfferDto
  ) {
    return this.offer.getOne(query, dto);
  }

  @Post('getForProfile')
  getForProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferQuery)) query: Query<Offer[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetOffersForProfileDto
  ) {
    return this.offer.getForProfile(query, token, dto);
  }

  @Post('create')
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferQuery)) query: Query<Offer>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: CreateOfferDto
  ) {
    return this.offer.create(query, token, dto);
  }

  @Post('update')
  update(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferQuery)) query: Query<Offer>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UpdateOfferDto
  ) {
    return this.offer.update(query, token, dto);
  }

  @Post('delete')
  delete(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteOfferDto
  ) {
    return this.offer.delete(query, token, dto);
  }

  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  uploadImages(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferQuery)) query: Query<Offer>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UploadOfferImageDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.offer.uploadImages(query, token, dto, files);
  }

  @Post('deleteImage')
  deleteImage(
    @Body(QUERY_KEY, new QueryValidationPipe(OfferQuery)) query: Query<Offer>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteOfferImageDto
  ) {
    return this.offer.deleteImage(query, token, dto);
  }
}
