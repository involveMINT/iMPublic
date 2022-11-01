import { Enrollment } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentEntity } from './enrollment.entity';

@Injectable()
export class EnrollmentRepository extends IOrchaTypeormRepository<Enrollment> {
  constructor(@InjectRepository(EnrollmentEntity) protected readonly repo: Repository<Enrollment>) {
    super(repo);
  }
}
