import { ServePartnerService } from '@involvemint/server/core/application-services';
import {
  DeleteSpImageDto,
  EditSpProfileDto,
  InvolvemintRoutes,
  ServePartner,
  UpdateSpLogoFileDto,
  UploadSpImagesDto,
  UserQuery,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  FILES_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, UseInterceptors, UploadedFiles, UploadedFile,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller(InvolvemintRoutes.servePartner)
export class ServePartnerController {
  constructor(private readonly servePartnerService: ServePartnerService) {}

  @Post('editProfile')
  async editProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.serveAdmins.servePartner)) query: Query<ServePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: EditSpProfileDto
  ) {
    return this.servePartnerService.editProfile(query, token, dto);
  }

  @Post('updateLogoFile')
  @UseInterceptors(FileInterceptor(FILES_KEY))
  async updateLogoFile(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.serveAdmins.servePartner)) query: Query<ServePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UpdateSpLogoFileDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.servePartnerService.updateLogoFile(query, token, dto, file);
  }

  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  async uploadImages(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.serveAdmins.servePartner)) query: Query<ServePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UploadSpImagesDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.servePartnerService.uploadImages(query, token, dto, files);
  }

  @Post('deleteImage')
  async deleteImage(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.serveAdmins.servePartner)) query: Query<ServePartner>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteSpImageDto
  ) {
    return this.servePartnerService.deleteImage(query, token, dto);
  }
}
