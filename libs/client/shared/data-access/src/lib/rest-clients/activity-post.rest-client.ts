import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivityPost,
  ActivityPostQuery,
  CreateActivityPostDto,
  DigestActivityPostDto,
  DTO_KEY,
  GetActivityPostDto,
  InvolvemintRoutes,
  IPaginate,
  IPagination,
  IParser,
  IQuery,
  LikeActivityPostDto,
  QUERY_KEY,
  UnlikeActivityPostDto,
  environment,
} from '@involvemint/shared/domain';

@Injectable()
export class ActivityPostRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.activityPost}`;

  constructor(private http: HttpClient) {}

  list(query: IQuery<ActivityPost[]>) {
    const body = {
      [QUERY_KEY]: query,
    };

    return this.http.post<IPagination<IParser<ActivityPost, IPaginate & typeof ActivityPostQuery>>>(
      `${this.apiUrl}/list`,
      body
    );
  }

  get(query: IQuery<ActivityPost>, dto: GetActivityPostDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<ActivityPost, typeof ActivityPostQuery>>(
      `${this.apiUrl}/get`,
      body
    );
  }

  create(query: IQuery<ActivityPost>, dto: CreateActivityPostDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<ActivityPost, typeof ActivityPostQuery>>(
      `${this.apiUrl}/create`,
      body
    );
  }

  like(query: IQuery<ActivityPost>, dto: LikeActivityPostDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<ActivityPost, typeof ActivityPostQuery>>(
      `${this.apiUrl}/like`,
      body
    );
  }

  unlike(query: IQuery<ActivityPost>, dto: UnlikeActivityPostDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<ActivityPost, typeof ActivityPostQuery>>(
      `${this.apiUrl}/unlike`,
      body
    );
  }

  digest(query: IQuery<ActivityPost[]>, dto: DigestActivityPostDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
    };

    return this.http.post<IParser<ActivityPost, typeof ActivityPostQuery>[]>(
      `${this.apiUrl}/digest`,
      body
    );
  }
}
