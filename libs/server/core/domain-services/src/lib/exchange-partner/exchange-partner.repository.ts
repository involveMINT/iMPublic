import { ExchangePartner } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ExchangePartnerEntity } from './exchange-partner.entity';

@Injectable()
export class ExchangePartnerRepository extends IBaseRepository<ExchangePartner> {
  constructor(@InjectRepository(ExchangePartnerEntity) protected readonly repo: Repository<ExchangePartner>) {
    super(repo);
  }
}
