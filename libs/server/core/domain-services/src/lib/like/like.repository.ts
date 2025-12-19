import { Like } from "@involvemint/shared/domain";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { LikeEntity } from './like.entity';


@Injectable()
export class LikeRepository extends IBaseRepository<Like> {
    constructor(@InjectRepository(LikeEntity) repo: Repository<Like>) {
        super(repo);
    }
}
