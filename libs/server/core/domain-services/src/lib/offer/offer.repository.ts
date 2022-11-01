import { Offer } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { OfferEntity } from './offer.entity';

@Injectable()
export class OfferRepository extends IOrchaTypeormRepository<Offer> {
  constructor(@InjectRepository(OfferEntity) protected readonly repo: Repository<Offer>) {
    super(repo);
  }
}
