import { Injectable } from "@nestjs/common";
import { ActivityPostRepository, LikeRepository } from "@involvemint/server/core/domain-services";
import { ActivityPost, ActivityPostQuery, CreateActivityPostDto, DisableActivityPostDto, EnableActivityPostDto, LikeActivityPostDto, likeQuery, UnlikeActivityPostDto } from "@involvemint/shared/domain";
import { IQuery } from "@orcha/common";
import { AuthService } from '../auth/auth.service';
import * as uuid from 'uuid';

@Injectable()
export class ActivityPostService {
    constructor(
        private readonly auth: AuthService,
        private readonly activityPostRepo: ActivityPostRepository,
        private readonly likeRepo: LikeRepository
    ) {}

    async list(query: IQuery<ActivityPost[]>, token: string) {
        return this.activityPostRepo.findAll(query);
    }

    async create(query: IQuery<ActivityPost>, token: string, dto: CreateActivityPostDto) {
        const user = await this.auth.validateUserToken(token ?? '');
        return this.activityPostRepo.upsert({
            id: uuid.v4(),
            user: user.id,
            poi: dto.poiId,
            likes: [],
            comments: [],
            likeCount: 0,
            dateCreated: new Date(),
            enabled: true
        },
        query);
    }

    async enable(query: IQuery<ActivityPost>, token: string, dto: EnableActivityPostDto) {
        return this.activityPostRepo.upsert({
            id: "",
            likeCount: 0,
            poi: undefined,
            likes: [],
            comments: [],
            user: undefined,
            dateCreated: "",
            enabled: false
        },
        query);
    }

    async disable(query: IQuery<ActivityPost>, token: string, dto: DisableActivityPostDto) {
        return this.activityPostRepo.upsert({
            id: "",
            likeCount: 0,
            poi: undefined,
            likes: [],
            comments: [],
            user: undefined,
            dateCreated: "",
            enabled: false
        },
        query);
    }

    async like(query: IQuery<ActivityPost>, token: string, dto: LikeActivityPostDto) {
        const user = await this.auth.validateUserToken(token ?? '');
        // did this user already like this post
        const likeRecords = await this.likeRepo.query(likeQuery, { where: { user: user.id } });

        if (likeRecords.length > 0) {
            throw new Error('User already liked this activity post');
        }
        // insert new record into 'like' table
       this.likeRepo.upsert({
            id: uuid.v4(),
            dateCreated: new Date(),
            activityPost: dto.postId,
            user: user.id
        },
        likeQuery);

        // update activity post like counter
        const currentPost = await this.activityPostRepo.findOneOrFail(dto.postId, ActivityPostQuery);
        return this.activityPostRepo.update(dto.postId, {likeCount: currentPost.likeCount + 1}, query);
    }

    async unlike(query: IQuery<ActivityPost>, token: string, dto: UnlikeActivityPostDto) {
        return this.activityPostRepo.upsert({
            id: "",
            likeCount: 0,
            poi: undefined,
            likes: [],
            comments: [],
            user: undefined,
            dateCreated: "",
            enabled: false
        },
        query);
    }

}
