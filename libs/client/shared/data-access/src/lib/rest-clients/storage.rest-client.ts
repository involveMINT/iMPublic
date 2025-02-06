import { HttpClient } from '@angular/common/http';
import { DTO_KEY, environment, GetStorageFileDto, InvolvemintRoutes, IParser, Query, QUERY_KEY } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.storage}`;

  constructor(private http: HttpClient) { }
  
  getUrl(query: Query<{ url: string }>, dto: GetStorageFileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ url: string }, { url: string }>>(`${this.apiUrl}/getUrl`, body);
  }
}
