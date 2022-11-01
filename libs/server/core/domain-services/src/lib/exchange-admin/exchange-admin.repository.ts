import { ExchangeAdmin } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { ExchangeAdminEntity } from './exchange-admin.entity';

@Injectable()
export class ExchangeAdminRepository extends IOrchaTypeormRepository<ExchangeAdmin> {
  constructor(@InjectRepository(ExchangeAdminEntity) protected readonly repo: Repository<ExchangeAdmin>) {
    super(repo);
  }
}
