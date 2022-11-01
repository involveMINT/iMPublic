import { QuestionAnswer } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { QuestionAnswerEntity } from './question-answer.entity';

@Injectable()
export class QuestionAnswerRepository extends IOrchaTypeormRepository<QuestionAnswer> {
  constructor(@InjectRepository(QuestionAnswerEntity) protected readonly repo: Repository<QuestionAnswer>) {
    super(repo);
  }
}
