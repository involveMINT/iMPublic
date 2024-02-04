import { ProjectService } from '@involvemint/server/core/application-services';
import {
  CreateProjectDto,
  DeleteProjectDto,
  DeleteProjectImageDto,
  GetProjectDto,
  InvolvemintRoutes,
  IProjectOrchestration,
  Project,
  ProjectFeedQuery,
  ProjectSpQuery,
  ProjectsQueryDto,
  ProjectsSpDto,
  UpdateProjectDto,
  UploadCustomWaiverDto,
  UploadProjectImageDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.project)
export class ProjectOrchestration implements IServerOrchestration<IProjectOrchestration> {
  constructor(private readonly projectService: ProjectService) {}

  @ServerOperation({ validateQuery: ProjectFeedQuery })
  getAll(query: IQuery<Project[]>, _: string, dto: ProjectsQueryDto) {
    return this.projectService.getAll(query, dto);
  }

  @ServerOperation({ validateQuery: ProjectFeedQuery })
  getOne(query: IQuery<Project>, token: string, dto: GetProjectDto) {
    return this.projectService.getOne(query, token, dto);
  }

  @ServerOperation({ validateQuery: ProjectSpQuery })
  getAllOwnedBySp(query: IQuery<Project[]>, token: string, dto: ProjectsSpDto) {
    return this.projectService.getAllOwnedBySp(query, token, dto);
  }

  @ServerOperation({ validateQuery: ProjectSpQuery })
  create(query: IQuery<Project>, token: string, dto: CreateProjectDto) {
    return this.projectService.create(query, token, dto);
  }

  @ServerOperation({ validateQuery: ProjectSpQuery })
  update(query: IQuery<Project>, token: string, dto: UpdateProjectDto) {
    return this.projectService.update(query, token, dto);
  }

  @ServerOperation({ validateQuery: ProjectSpQuery, fileUpload: 'multiple' })
  uploadImages(
    query: IQuery<Project>,
    token: string,
    dto: UploadProjectImageDto,
    files: Express.Multer.File[]
  ) {
    return this.projectService.uploadImages(query, token, dto, files);
  }

  @ServerOperation({ validateQuery: ProjectSpQuery })
  deleteImage(query: IQuery<Project>, token: string, dto: DeleteProjectImageDto) {
    return this.projectService.deleteImage(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  delete(query: IQuery<{ deletedId: string }>, token: string, dto: DeleteProjectDto) {
    return this.projectService.delete(query, token, dto);
  }

  @ServerOperation({ validateQuery: ProjectSpQuery, fileUpload: 'singular' })
  uploadCustomWaiver(
    query: IQuery<Project>,
    token: string,
    dto: UploadCustomWaiverDto,
    file: Express.Multer.File
  ) {
    return this.projectService.uploadCustomWaiver(query, token, dto, file);
  }
}
