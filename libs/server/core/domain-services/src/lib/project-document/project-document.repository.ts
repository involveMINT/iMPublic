import { ProjectDocument } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ProjectDocumentEntity } from './project-document.entity';

@Injectable()
export class ProjectDocumentRepository extends IBaseRepository<ProjectDocument> {
  constructor(@InjectRepository(ProjectDocumentEntity) protected readonly repo: Repository<ProjectDocument>) {
    super(repo);
  }
}
