import { Credit } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { CreditEntity } from './credit.entity';

@Injectable()
export class CreditRepository extends IBaseRepository<Credit> {
  constructor(@InjectRepository(CreditEntity) protected readonly repo: Repository<Credit>) {
    super(repo);
  }
}
