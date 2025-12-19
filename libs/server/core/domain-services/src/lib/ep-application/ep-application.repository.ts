import { EpApplication } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { EpApplicationEntity } from './ep-application.entity';

@Injectable()
export class EpApplicationRepository extends IBaseRepository<EpApplication> {
  constructor(@InjectRepository(EpApplicationEntity) protected readonly repo: Repository<EpApplication>) {
    super(repo);
  }
}
