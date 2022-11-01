import { LinkedVoucherOffer } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { LinkedVoucherOfferEntity } from './linked-voucher-offers.entity';

@Injectable()
export class LinkedVoucherOfferRepository extends IOrchaTypeormRepository<LinkedVoucherOffer> {
  constructor(
    @InjectRepository(LinkedVoucherOfferEntity) protected readonly repo: Repository<LinkedVoucherOffer>
  ) {
    super(repo);
  }
}
