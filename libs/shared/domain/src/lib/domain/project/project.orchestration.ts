import { IOperation } from '@orcha/common';
import {
  CreateProjectDto,
  DeleteProjectDto,
  DeleteProjectImageDto,
  GetProjectDto,
  ProjectsQueryDto,
  ProjectsSpDto,
  UpdateProjectDto,
  UploadCustomWaiverDto,
  UploadProjectImageDto,
} from './project.dtos';
import { Project } from './project.model';

export interface IProjectOrchestration {
  getAll: IOperation<Project[], ProjectsQueryDto>;
  getOne: IOperation<Project, GetProjectDto>;
  getAllOwnedBySp: IOperation<Project[], ProjectsSpDto>;
  create: IOperation<Project, CreateProjectDto>;
  update: IOperation<Project, UpdateProjectDto>;
  uploadImages: IOperation<Project, UploadProjectImageDto, File[]>;
  deleteImage: IOperation<Project, DeleteProjectImageDto>;
  delete: IOperation<{ deletedId: string }, DeleteProjectDto>;
  uploadCustomWaiver: IOperation<Project, UploadCustomWaiverDto, File>;
}
