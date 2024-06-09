import { Question } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionRepository extends IBaseRepository<Question> {
  constructor(@InjectRepository(QuestionEntity) protected readonly repo: Repository<Question>) {
    super(repo);
  }
}
