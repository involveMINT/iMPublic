import { Question } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionRepository extends IOrchaTypeormRepository<Question> {
  constructor(@InjectRepository(QuestionEntity) protected readonly repo: Repository<Question>) {
    super(repo);
  }
}
