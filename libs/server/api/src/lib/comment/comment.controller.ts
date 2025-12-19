import { CommentService } from '@involvemint/server/core/application-services';
import {
  Comment,
  CommentQuery,
  CreateCommentDto,
  DTO_KEY,
  FlagCommentDto,
  HideCommentDto,
  InvolvemintRoutes,
  IQuery,
  QUERY_KEY,
  TOKEN_KEY,
  UnflagCommentDto,
  UnhideCommentDto,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.comment)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('list')
  list(
    @Body(QUERY_KEY, new QueryValidationPipe(CommentQuery)) query: IQuery<Comment[]>,
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.commentService.list(query, token);
  }

  @Post('create')
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(CommentQuery)) query: IQuery<Comment>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: CreateCommentDto
  ) {
    return this.commentService.create(query, token, dto);
  }

  @Post('flag')
  flag(
    @Body(QUERY_KEY, new QueryValidationPipe(CommentQuery)) query: IQuery<Comment>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: FlagCommentDto
  ) {
    return this.commentService.flag(query, token, dto);
  }

  @Post('unflag')
  unflag(
    @Body(QUERY_KEY, new QueryValidationPipe(CommentQuery)) query: IQuery<Comment>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: UnflagCommentDto
  ) {
    return this.commentService.unflag(query, token, dto);
  }

  @Post('hide')
  hide(
    @Body(QUERY_KEY, new QueryValidationPipe(CommentQuery)) query: IQuery<Comment>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: HideCommentDto
  ) {
    return this.commentService.hide(query, token, dto);
  }

  @Post('unhide')
  unhide(
    @Body(QUERY_KEY, new QueryValidationPipe(CommentQuery)) query: IQuery<Comment>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: UnhideCommentDto
  ) {
    return this.commentService.unhide(query, token, dto);
  }
}
