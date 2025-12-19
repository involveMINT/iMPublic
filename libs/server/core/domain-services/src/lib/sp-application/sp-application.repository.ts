import { SpApplication } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { SpApplicationEntity } from './sp-application.entity';

@Injectable()
export class SpApplicationRepository extends IBaseRepository<SpApplication> {
  constructor(@InjectRepository(SpApplicationEntity) protected readonly repo: Repository<SpApplication>) {
    super(repo);
  }
}
