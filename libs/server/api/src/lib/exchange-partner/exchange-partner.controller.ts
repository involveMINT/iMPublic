import { ExchangePartnerService } from '@involvemint/server/core/application-services';
import {
  DeleteEpImageDto,
  EditEpProfileDto,
  ExchangePartner,
  ExchangePartnerMarketQuery,
  ExchangePartnerMarketQueryDto,
  ExchangePartnerSearchQuery,
  GetOneExchangePartnerDto,
  InvolvemintRoutes,
  SearchEpDto,
  UpdateEpLogoFileDto,
  UploadEpImagesDto,
  UserQuery,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  FILES_KEY,
} from '@involvemint/shared/domain';
import { 
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Headers
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.exchangePartner)
export class ExchangePartnerController {
  constructor(private readonly ep: ExchangePartnerService) {}

  @Post('query')
  query(
    @Body(QUERY_KEY, new QueryValidationPipe(ExchangePartnerMarketQuery)) query: Query<ExchangePartner[]>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ExchangePartnerMarketQueryDto
  ) {
    return this.ep.query(query, dto);
  }

  @Post('getOne')
  async getOne(
    @Body(QUERY_KEY, new QueryValidationPipe(ExchangePartnerMarketQuery)) query: Query<ExchangePartner>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetOneExchangePartnerDto
  ) {
    return this.ep.getOne(query, dto);
  }

  @Post('searchEps')
  async searchEps(
    @Body(QUERY_KEY, new QueryValidationPipe(ExchangePartnerSearchQuery)) query: Query<ExchangePartner>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SearchEpDto
  ) {
    return this.ep.searchEps(query, dto);
  }

  @Post('editProfile')
  async editProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.exchangeAdmins.exchangePartner)) query: Query<ExchangePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: EditEpProfileDto
  ) {
    return this.ep.editProfile(query, token, dto);
  }

  @Post('updateLogoFile')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  async updateLogoFile(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.exchangeAdmins.exchangePartner)) query: Query<ExchangePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UpdateEpLogoFileDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.ep.updateLogoFile(query, token, dto, files[0]);
  }

  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  async uploadImages(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.exchangeAdmins.exchangePartner)) query: Query<ExchangePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UploadEpImagesDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.ep.uploadImages(query, token, dto, files);
  }

  @Post('deleteImage')
  async deleteImage(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.exchangeAdmins.exchangePartner)) query: Query<ExchangePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteEpImageDto
  ) {
    return this.ep.deleteImage(query, token, dto);
  }
}
