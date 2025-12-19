import { PassportDocument } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { PassportDocumentEntity } from './passport-document.entity';

@Injectable()
export class PassportDocumentRepository extends IBaseRepository<PassportDocument> {
  constructor(
    @InjectRepository(PassportDocumentEntity) protected readonly repo: Repository<PassportDocument>
  ) {
    super(repo);
  }
}
