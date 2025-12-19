import { ServePartner } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ServePartnerEntity } from './serve-partner.entity';

@Injectable()
export class ServePartnerRepository extends IBaseRepository<ServePartner> {
  constructor(@InjectRepository(ServePartnerEntity) protected readonly repo: Repository<ServePartner>) {
    super(repo);
  }
}
