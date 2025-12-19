import { ServeAdmin } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { ServeAdminEntity } from './serve-admin.entity';

@Injectable()
export class ServeAdminRepository extends IBaseRepository<ServeAdmin> {
  constructor(@InjectRepository(ServeAdminEntity) protected readonly repo: Repository<ServeAdmin>) {
    super(repo);
  }
}
