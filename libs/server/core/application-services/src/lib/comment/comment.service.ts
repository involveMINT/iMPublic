import { Injectable } from "@nestjs/common";
import { AuthService } from '@involvemint/server/core/application-services';
import { CommentRepository } from "@involvemint/server/core/domain-services";
import { IQuery } from '@orcha/common';
import * as uuid from 'uuid';
import { CreateCommentDto } from "@involvemint/shared/domain";
import { HideCommentDto, UnhideCommentDto } from "libs/shared/domain/src/lib/domain/comment";

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
        const user = await this.auth.validateUserToken(token ?? '');
        return this.commentRepo.upsert({
            id: uuid.v4(),
            text: dto.text,
            activityPost: dto.postId,
            user: user.id,
            dateCreated: new Date(),
            hidden: false
        },
        query);
    }

    async hide(query: IQuery<Comment>, token: string, dto: HideCommentDto) {
        const user = await this.auth.validateUserToken(token ?? '');
        return this.commentRepo.upsert({
            id: dto.commentId,
            // text: "",
            // activityPost: null,
            // user: undefined,
            // dateCreated: "",
            hidden: true
        },
        query);
    }

    async unhide(query: IQuery<Comment>, token: string, dto: UnhideCommentDto) {
        const user = await this.auth.validateUserToken(token ?? '');
        return this.commentRepo.upsert({
            id: dto.commentId,
            // text: "",
            // activityPost: null,
            // user: undefined,
            // dateCreated: "",
            hidden: false
        },
        query);
    }

}
