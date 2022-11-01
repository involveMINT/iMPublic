import { ExchangePartner } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { ExchangePartnerEntity } from './exchange-partner.entity';

@Injectable()
export class ExchangePartnerRepository extends IOrchaTypeormRepository<ExchangePartner> {
  constructor(@InjectRepository(ExchangePartnerEntity) protected readonly repo: Repository<ExchangePartner>) {
    super(repo);
  }
}
