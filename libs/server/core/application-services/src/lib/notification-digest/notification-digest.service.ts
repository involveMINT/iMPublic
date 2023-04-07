import { Injectable } from "@nestjs/common";
import { ActivityPostRepository, CommentRepository, LikeRepository } from "@involvemint/server/core/domain-services";
import { ActivityPost, ActivityPostQuery, CreateActivityPostDto, DisableActivityPostDto, EnableActivityPostDto, LikeActivityPostDto, likeQuery, UnlikeActivityPostDto } from "@involvemint/shared/domain";
import { IQuery } from "@orcha/common";
import { AuthService } from '../auth/auth.service';
import * as uuid from 'uuid';
import { MoreThan } from 'typeorm';

@Injectable()
export class NotificationDigestService {
    constructor(
        private readonly auth: AuthService,
        private readonly activityPostRepo: ActivityPostRepository,
        private readonly likeRepo: LikeRepository,
        private readonly commentRepo: CommentRepository
    ) {}

    // async getRecentLikes(recentPosts: IParserObject<ActivityPost, IQueryObject<ActivityPost>>[], lastDays:Date) {
    //   const recentLikes: any = [];
    //   recentPosts.forEach( async (post) => {
    //     let likes = await this.likeRepo.query({id: true, user: {id: true}}, 
    //                                           {where: { dateCreated: MoreThan(lastDays), activityPost: post.id}})
    //     recentLikes.apply(...likes);
    //   });
    //   return recentLikes;
    // }

    async notificationUpdate(query: IQuery<ActivityPost>, token: string) {
        const user = await this.auth.validateUserToken(token ?? '');

        // get the recent posts for this user.  Recent = min(7 days, lastLoggedIn)
        const days = 1; // Past days you want to get
        const currDate = new Date();
        const lastDays = new Date(currDate.getTime() - (days * 24 * 60 * 60 * 1000));
        
        return this.activityPostRepo.query(query, {where: { dateCreated: MoreThan(lastDays.getTime()), user: user.id }})
    }

}