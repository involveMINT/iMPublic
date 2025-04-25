import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { ClearanceEntity } from './clearance.entity';

@Injectable()
export class ClearanceRepository {
  constructor(
    @InjectRepository(ClearanceEntity)
    private readonly repo: Repository<ClearanceEntity>
  ) {}

  deleteManyByProjectId(projectId: string): Promise<DeleteResult> {
    return this.repo.delete({ projectId });
  }
}