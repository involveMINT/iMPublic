import { ProjectDocument } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { ProjectDocumentEntity } from './project-document.entity';

@Injectable()
export class ProjectDocumentRepository extends IOrchaTypeormRepository<ProjectDocument> {
  constructor(@InjectRepository(ProjectDocumentEntity) protected readonly repo: Repository<ProjectDocument>) {
    super(repo);
  }
}
