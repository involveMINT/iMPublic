import { Flag } from "@involvemint/shared/domain";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { IBaseRepository } from '../repository/typeorm-base-repository';
import { FlagEntity } from './flag.entity';


@Injectable()
export class FlagRepository extends IBaseRepository<Flag> {
    constructor(@InjectRepository(FlagEntity) repo: Repository<Flag>) {
        super(repo);
    }
}
