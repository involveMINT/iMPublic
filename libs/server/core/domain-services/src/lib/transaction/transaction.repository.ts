import { Transaction } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Injectable()
export class TransactionRepository extends IBaseRepository<Transaction> {
  constructor(@InjectRepository(TransactionEntity) protected readonly repo: Repository<Transaction>) {
    super(repo);
  }
}
