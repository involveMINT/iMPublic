import { ExchangeAdmin } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ExchangeAdminEntity } from './exchange-admin.entity';

@Injectable()
export class ExchangeAdminRepository extends IBaseRepository<ExchangeAdmin> {
  constructor(@InjectRepository(ExchangeAdminEntity) protected readonly repo: Repository<ExchangeAdmin>) {
    super(repo);
  }
}
