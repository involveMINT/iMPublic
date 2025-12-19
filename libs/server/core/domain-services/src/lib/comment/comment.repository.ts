import { Injectable } from '@nestjs/common';
import { Comment } from '@involvemint/shared/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { CommentEntity } from './comment.entity';


@Injectable()
export class CommentRepository extends IBaseRepository<Comment> {
    constructor(@InjectRepository(CommentEntity) repo: Repository<Comment>) {
        super(repo);
    }
}
