import { ProjectService } from '@involvemint/server/core/application-services';
import {
  CreateProjectDto,
  DeleteProjectDto,
  DeleteProjectImageDto,
  GetProjectDto,
  InvolvemintRoutes,
  Project,
  ProjectFeedQuery,
  ProjectSpQuery,
  ProjectsQueryDto,
  ProjectsSpDto,
  UpdateProjectDto,
  UploadCustomWaiverDto,
  UploadProjectImageDto,
  Query,
  TOKEN_KEY,
  DTO_KEY,
  QUERY_KEY,
  FILES_KEY,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, UploadedFiles, UploadedFile, UseInterceptors,
  Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller(InvolvemintRoutes.project)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('getAll')
  getAll(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectFeedQuery)) query: Query<Project[]>, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ProjectsQueryDto
  ) {
    return this.projectService.getAll(query, dto);
  }

  @Post('getOne')
  getOne(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectFeedQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GetProjectDto
  ) {
    return this.projectService.getOne(query, token, dto);
  }

  @Post('getAllOwnedBySp')
  getAllOwnedBySp(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectSpQuery)) query: Query<Project[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ProjectsSpDto
  ) {
    return this.projectService.getAllOwnedBySp(query, token, dto);
  }

  @Post('create')
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: CreateProjectDto
  ) {
    return this.projectService.create(query, token, dto);
  }

  @Post('update')
  update(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UpdateProjectDto
  ) {
    return this.projectService.update(query, token, dto);
  }

  @Post('uploadImages')
  @UseInterceptors(FilesInterceptor(FILES_KEY))
  uploadImages(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UploadProjectImageDto, 
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.projectService.uploadImages(query, token, dto, files);
  }

  @Post('deleteImage')
  deleteImage(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteProjectImageDto
  ) {
    return this.projectService.deleteImage(query, token, dto);
  }

  @Post('delete')
  delete(
    @Body(QUERY_KEY, new QueryValidationPipe({ deletedId: true })) query: Query<{ deletedId: string }>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: DeleteProjectDto
  ) {
    return this.projectService.delete(query, token, dto);
  }

  @Post('uploadCustomWaiver')
  @UseInterceptors(FileInterceptor(FILES_KEY))
  uploadCustomWaiver(
    @Body(QUERY_KEY, new QueryValidationPipe(ProjectSpQuery)) query: Query<Project>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: UploadCustomWaiverDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.projectService.uploadCustomWaiver(query, token, dto, file);
  }
}
