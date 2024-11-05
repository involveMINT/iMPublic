import { Project } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectRepository extends IBaseRepository<Project> {
  constructor(@InjectRepository(ProjectEntity) protected readonly repo: Repository<Project>) {
    super(repo);
  }
}
