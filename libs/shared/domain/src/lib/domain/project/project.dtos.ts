import { IsInt, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import { Project } from './project.model';

export abstract class ProjectsQueryDto {
  @IsOptional()
  distance?: string;
}

export abstract class ProjectsSpDto {
  @IsString()
  spId!: string;
}

export abstract class CreateProjectDto {
  @IsString()
  spId!: string;
}

export abstract class GetProjectDto {
  @IsString()
  projectId!: string;
}

export abstract class UpdateProjectDto {
  @IsString()
  projectId!: string;

  @IsNotEmptyObject()
  changes!: Partial<Omit<Project, 'id'>>;
}

export abstract class UploadProjectImageDto {
  @IsString()
  projectId!: string;
}

export abstract class DeleteProjectImageDto {
  @IsString()
  projectId!: string;

  @IsInt()
  index!: number;
}

export abstract class DeleteProjectDto {
  @IsString()
  projectId!: string;
}

export abstract class UploadCustomWaiverDto {
  @IsString()
  projectId!: string;
}
