import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Comment,
  CommentQuery,
  CreateCommentDto,
  DTO_KEY,
  FlagCommentDto,
  HideCommentDto,
  InvolvemintRoutes,
  IParser,
  IQuery,
  QUERY_KEY,
  UnflagCommentDto,
  UnhideCommentDto,
  environment,
} from '@involvemint/shared/domain';

@Injectable()
export class CommentRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.comment}`;

  constructor(private http: HttpClient) {}

  list(query: IQuery<Comment[]>) {
    const body = {
      [QUERY_KEY]: query,
    };

    return this.http.post<IParser<Comment, typeof CommentQuery>[]>(
      `${this.apiUrl}/list`,
      body
    );
  }

  create(query: IQuery<Comment>, dto: CreateCommentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<Comment, typeof CommentQuery>>(
      `${this.apiUrl}/create`,
      body
    );
  }

  flag(query: IQuery<Comment>, dto: FlagCommentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<Comment, typeof CommentQuery>>(
      `${this.apiUrl}/flag`,
      body
    );
  }

  unflag(query: IQuery<Comment>, dto: UnflagCommentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<Comment, typeof CommentQuery>>(
      `${this.apiUrl}/unflag`,
      body
    );
  }

  hide(query: IQuery<Comment>, dto: HideCommentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<Comment, typeof CommentQuery>>(
      `${this.apiUrl}/hide`,
      body
    );
  }

  unhide(query: IQuery<Comment>, dto: UnhideCommentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<Comment, typeof CommentQuery>>(
      `${this.apiUrl}/unhide`,
      body
    );
  }
}
