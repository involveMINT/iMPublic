import { EpApplication } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { EpApplicationEntity } from './ep-application.entity';

@Injectable()
export class EpApplicationRepository extends IOrchaTypeormRepository<EpApplication> {
  constructor(@InjectRepository(EpApplicationEntity) protected readonly repo: Repository<EpApplication>) {
    super(repo);
  }
}
