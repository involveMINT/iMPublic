import { ServePartner } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { ServePartnerEntity } from './serve-partner.entity';

@Injectable()
export class ServePartnerRepository extends IOrchaTypeormRepository<ServePartner> {
  constructor(@InjectRepository(ServePartnerEntity) protected readonly repo: Repository<ServePartner>) {
    super(repo);
  }
}
