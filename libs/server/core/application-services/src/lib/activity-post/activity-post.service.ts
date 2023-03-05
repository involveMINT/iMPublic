import { Injectable } from "@nestjs/common";
import { ActivityPostRepository } from "@involvemint/server/core/domain-services";
import { ActivityPost, CreateActivityPostDto, DisableActivityPostDto, EnableActivityPostDto, LikeActivityPostDto, UnlikeActivityPostDto } from "@involvemint/shared/domain";
import { IQuery } from "@orcha/common";
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ActivityPostService {
    constructor(
        private readonly auth: AuthService,
        private readonly activityPostRepo: ActivityPostRepository
    ) {}

    async list(query: IQuery<ActivityPost[]>, token: string) {
        return this.activityPostRepo.findAll(query);
    }

    async create(query: IQuery<ActivityPost>, token: string, dto: CreateActivityPostDto) {
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
