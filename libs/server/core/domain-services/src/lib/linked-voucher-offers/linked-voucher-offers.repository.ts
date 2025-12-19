import { LinkedVoucherOffer } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { LinkedVoucherOfferEntity } from './linked-voucher-offers.entity';

@Injectable()
export class LinkedVoucherOfferRepository extends IBaseRepository<LinkedVoucherOffer> {
  constructor(
    @InjectRepository(LinkedVoucherOfferEntity) protected readonly repo: Repository<LinkedVoucherOffer>
  ) {
    super(repo);
  }
}
