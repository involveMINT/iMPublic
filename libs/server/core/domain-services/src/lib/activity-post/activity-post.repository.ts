import { ActivityPost } from "@involvemint/shared/domain";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { ActivityPostEntity } from './activity-post.entity';


/**
 * Activity Post Repository
 *
 * Uses the Activity Post entity and modal defined previously to instantiate a
 * repository (basically a table in a database to store the values). These
 * repositories are then commonly used in backend services to execute server
 * logic on orchestration calls and update database values.
 */
@Injectable()
export class ActivityPostRepository extends IBaseRepository<ActivityPost> {
    constructor(@InjectRepository(ActivityPostEntity) repo: Repository<ActivityPost>) {
        super(repo);
    }
}
