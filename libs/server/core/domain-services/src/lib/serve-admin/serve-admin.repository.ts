import { ServeAdmin } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { ServeAdminEntity } from './serve-admin.entity';

@Injectable()
export class ServeAdminRepository extends IOrchaTypeormRepository<ServeAdmin> {
  constructor(@InjectRepository(ServeAdminEntity) protected readonly repo: Repository<ServeAdmin>) {
    super(repo);
  }
}
