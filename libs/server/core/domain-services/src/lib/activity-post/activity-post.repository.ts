import { ActivityPost } from "@involvemint/shared/domain";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IOrchaTypeormRepository } from "@orcha/typeorm";
import { Repository } from "typeorm";
import { ActivityPostEntity } from './activity-post.entity';

@Injectable()
export class ActivityPostRepository extends IOrchaTypeormRepository<ActivityPost> {
    constructor(@InjectRepository(ActivityPostEntity) protected readonly repo: Repository<ActivityPost>) {
        super(repo);
    }
}
