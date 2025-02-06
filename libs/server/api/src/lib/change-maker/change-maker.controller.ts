import { ChangeMakerService } from '@involvemint/server/core/application-services';
import {
  ChangeMaker,
  CreateChangeMakerProfileDto,
  EditCmProfileDto,
  InvolvemintRoutes,
  QUERY_KEY,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  FILES_KEY,
  UserQuery,
} from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    Headers
  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.changeMaker)
export class ChangeMakerController {
    constructor(private readonly cmService: ChangeMakerService) {}

  @Post('createProfile')
  createProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.changeMaker)) query: Query<ChangeMaker>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: CreateChangeMakerProfileDto
  ) {
      return this.cmService.createProfile(query, token, dto);
  }

  @Post('editProfile')
  async editProfile(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.changeMaker)) query: Query<ChangeMaker>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: EditCmProfileDto
  ) {
    return this.cmService.editProfile(query, token, dto);
  }

  @Post('updateProfileImage')
  @UseInterceptors(FileInterceptor(FILES_KEY))
  async updateProfileImage(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery.changeMaker)) query: Query<ChangeMaker>, 
    @Headers(TOKEN_KEY) token: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.cmService.updateProfileImage(query, token, file);
  }
}
