import { Injectable } from "@nestjs/common";
import { AuthService } from '@involvemint/server/core/application-services';
import { CommentRepository } from "@involvemint/server/core/domain-services";
import { IQuery } from '@orcha/common';
import { Comment, CreateCommentDto, HideCommentDto, UnhideCommentDto } from "@involvemint/shared/domain";

@Injectable()
export class CommentService {
    constructor(
        private readonly auth: AuthService,
        private readonly commentRepo: CommentRepository
    ) {}

    async list(query: IQuery<Comment[]>, token: string) {
        return this.commentRepo.findAll(query);
    }

    async create(query: IQuery<Comment>, token: string, dto: CreateCommentDto) {
        return this.commentRepo.upsert({
            id: "",
            text: "",
            activityPost: null,
            user: undefined,
            dateCreated: "",
            hidden: false
        },
        query);
    }

    async hide(query: IQuery<Comment>, token: string, dto: HideCommentDto) {
        return this.commentRepo.upsert({
            id: "",
            text: "",
            activityPost: null,
            user: undefined,
            dateCreated: "",
            hidden: false
        },
        query);
    }

    async unhide(query: IQuery<Comment>, token: string, dto: UnhideCommentDto) {
        return this.commentRepo.upsert({
            id: "",
            text: "",
            activityPost: null,
            user: undefined,
            dateCreated: "",
            hidden: false
        },
        query);
    }

}
