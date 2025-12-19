import { ActivityPostService } from '@involvemint/server/core/application-services';
import {
  ActivityPost,
  ActivityPostQuery,
  CreateActivityPostDto,
  DigestActivityPostDto,
  DTO_KEY,
  GetActivityPostDto,
  InvolvemintRoutes,
  IQuery,
  LikeActivityPostDto,
  QUERY_KEY,
  TOKEN_KEY,
  UnlikeActivityPostDto,
} from '@involvemint/shared/domain';
import { Controller, Post, Body, Headers } from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.activityPost)
export class ActivityPostController {
  constructor(private readonly activityPostService: ActivityPostService) {}

  @Post('list')
  list(
    @Body(QUERY_KEY, new QueryValidationPipe(ActivityPostQuery)) query: IQuery<ActivityPost[]>,
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.activityPostService.list(query, token);
  }

  @Post('get')
  get(
    @Body(QUERY_KEY, new QueryValidationPipe(ActivityPostQuery)) query: IQuery<ActivityPost>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: GetActivityPostDto
  ) {
    return this.activityPostService.get(query, token, dto);
  }

  @Post('create')
  create(
    @Body(QUERY_KEY, new QueryValidationPipe(ActivityPostQuery)) query: IQuery<ActivityPost>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: CreateActivityPostDto
  ) {
    return this.activityPostService.create(query, token, dto);
  }

  @Post('like')
  like(
    @Body(QUERY_KEY, new QueryValidationPipe(ActivityPostQuery)) query: IQuery<ActivityPost>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: LikeActivityPostDto
  ) {
    return this.activityPostService.like(query, token, dto);
  }

  @Post('unlike')
  unlike(
    @Body(QUERY_KEY, new QueryValidationPipe(ActivityPostQuery)) query: IQuery<ActivityPost>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: UnlikeActivityPostDto
  ) {
    return this.activityPostService.unlike(query, token, dto);
  }

  @Post('digest')
  digest(
    @Body(QUERY_KEY, new QueryValidationPipe(ActivityPostQuery)) query: IQuery<ActivityPost[]>,
    @Headers(TOKEN_KEY) token: string,
    @Body(DTO_KEY, new ValidationPipe()) dto: DigestActivityPostDto
  ) {
    return this.activityPostService.digest(query, token, dto);
  }
}
