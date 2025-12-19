import { ChangeMaker } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ChangeMakerEntity } from './change-maker.entity';

@Injectable()
export class ChangeMakerRepository extends IBaseRepository<ChangeMaker> {
  constructor(@InjectRepository(ChangeMakerEntity) protected readonly repo: Repository<ChangeMaker>) {
    super(repo);
  }
}
