import { Injectable } from "@nestjs/common";
import { ActivityPostRepository, LikeRepository } from "@involvemint/server/core/domain-services";
import { IPaginate, IParserObject, IQuery } from "@orcha/common";
import { AuthService } from '../auth/auth.service';
import * as uuid from 'uuid';
import { IQueryObject } from "@orcha/common/src/lib/query";
import { ActivityPost, ActivityPostQuery, CreateActivityPostDto, DigestActivityPostDto, DisableActivityPostDto, EnableActivityPostDto, LikeActivityPostDto, likeQuery, RecentActivityPostDto, UnlikeActivityPostDto } from "@involvemint/shared/domain";
import { MoreThan } from 'typeorm';

@Injectable()
export class ActivityPostService {
    constructor(
        private readonly auth: AuthService,
        private readonly activityPostRepo: ActivityPostRepository,
        private readonly likeRepo: LikeRepository
    ) {}

    async list(query: IQuery<ActivityPost[]>, token: string, dto: RecentActivityPostDto) {
        const user = await this.auth.validateUserToken(token ?? '');
        if (dto.recent) {
            // get the recent posts for this user.  Recent = min(7 days, lastLoggedIn)
            const days = 1; // Past days you want to get
            const currDate = new Date();
            const lastDays = new Date(currDate.getTime() - (days * 24 * 60 * 60 * 1000));
            console.log(lastDays.toISOString);
            
            return this.activityPostRepo.query(query, {where: { dateCreated: MoreThan(lastDays.toLocaleDateString()), user: user.id }})
        }
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
        const likeRecords = await this.likeRepo.query(likeQuery, { where: { user: user.id, activityPost: dto.postId } });

        if (likeRecords.length > 0) {
            throw new Error('User already liked this activity post');
        }
        // insert new record into 'like' table
       await this.likeRepo.upsert({
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
        const user = await this.auth.validateUserToken(token ?? '');
        // make sure user liked the post
        const likeRecords = await this.likeRepo.query(likeQuery, { where: { user: user.id, activityPost: dto.postId } });
        if (likeRecords.length == 0) {
            throw new Error('User has not liked this activity post');
        }

        // Remove like record from like repo
        // We can index into 1st index because we do the check above
        await this.likeRepo.delete(likeRecords[0].id);

        // update activity post like counter
        const currentPost = await this.activityPostRepo.findOneOrFail(dto.postId, ActivityPostQuery);
        return this.activityPostRepo.update(dto.postId, {likeCount: currentPost.likeCount - 1}, query);
    }

    async digest(query: IQuery<ActivityPost[]>, token: string, dto: DigestActivityPostDto) {
        const user = await this.auth.validateUserToken(token ?? '');
        const startDate = new Date(dto.startDate);
        const posts = await this.activityPostRepo.query(query, { where: { user: user.id }});
        const res: IParserObject<ActivityPost, IQueryObject<ActivityPost> & IPaginate>[] = [];
        posts.forEach(post => {
            post.comments = post.comments?.filter(comment => new Date(comment?.dateCreated as any) >= startDate);
            post.likes = post.likes?.filter(like => new Date(like?.dateCreated as any) >= startDate);
            if ((post.comments?.length ?? 0 > 0) || (post.likes?.length ?? 0 > 0)) res.push(post);
        });
        console.log(posts);
        console.log(res);
        console.log(startDate);
        return res;
    }

}
