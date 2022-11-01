import { Project } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectRepository extends IOrchaTypeormRepository<Project> {
  constructor(@InjectRepository(ProjectEntity) protected readonly repo: Repository<Project>) {
    super(repo);
  }
}
