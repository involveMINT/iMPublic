import { Voucher } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { VoucherEntity } from './voucher.entity';

@Injectable()
export class VoucherRepository extends IOrchaTypeormRepository<Voucher> {
  constructor(@InjectRepository(VoucherEntity) protected readonly repo: Repository<Voucher>) {
    super(repo);
  }
}
