import { Request } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { RequestEntity } from './request.entity';

@Injectable()
export class RequestRepository extends IOrchaTypeormRepository<Request> {
  constructor(@InjectRepository(RequestEntity) protected readonly repo: Repository<Request>) {
    super(repo);
  }
}
