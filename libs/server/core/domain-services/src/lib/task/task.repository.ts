import { Task } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskRepository extends IBaseRepository<Task> {
  constructor(@InjectRepository(TaskEntity) protected readonly repo: Repository<Task>) {
    super(repo);
  }
}
