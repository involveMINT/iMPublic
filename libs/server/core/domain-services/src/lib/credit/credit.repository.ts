import { Credit } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { CreditEntity } from './credit.entity';

@Injectable()
export class CreditRepository extends IOrchaTypeormRepository<Credit> {
  constructor(@InjectRepository(CreditEntity) protected readonly repo: Repository<Credit>) {
    super(repo);
  }
}
