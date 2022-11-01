import { EnrollmentDocument } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentDocumentEntity } from './enrollment-document.entity';

@Injectable()
export class EnrollmentDocumentRepository extends IOrchaTypeormRepository<EnrollmentDocument> {
  constructor(
    @InjectRepository(EnrollmentDocumentEntity) protected readonly repo: Repository<EnrollmentDocument>
  ) {
    super(repo);
  }
}
