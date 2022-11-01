import { SpApplication } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { SpApplicationEntity } from './sp-application.entity';

@Injectable()
export class SpApplicationRepository extends IOrchaTypeormRepository<SpApplication> {
  constructor(@InjectRepository(SpApplicationEntity) protected readonly repo: Repository<SpApplication>) {
    super(repo);
  }
}
