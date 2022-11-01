import { Task } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOrchaTypeormRepository } from '@orcha/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskRepository extends IOrchaTypeormRepository<Task> {
  constructor(@InjectRepository(TaskEntity) protected readonly repo: Repository<Task>) {
    super(repo);
  }
}
