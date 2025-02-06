import { HttpClient } from '@angular/common/http';
import { CreateRequestDto, DTO_KEY, DeleteRequestDto, DeleteRequestImageDto, FILES_KEY, GetOneRequestDto, GetRequestsForProfileDto, ExactQuery, IPagination, IParser, Query, InvolvemintRoutes, QUERY_KEY, QueryRequestsDto, Request, RequestMarketQuery, RequestQuery, UpdateRequestDto, UploadRequestImageDto, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class RequestRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.request}`;

  constructor(private http: HttpClient) { }
  
  query(query: Query<Request[]>, dto: QueryRequestsDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IPagination<IParser<Request, typeof RequestMarketQuery>>>(`${this.apiUrl}/query`, body);
  }

  getOne(query: Query<Request>, dto: GetOneRequestDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestMarketQuery>>(`${this.apiUrl}/getOne`, body);
  }

  getForProfile(query: Query<Request[]>, dto: GetRequestsForProfileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  create(query: Query<Request>, dto: CreateRequestDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/create`, body);
  }

  update(query: Query<Request>, dto: UpdateRequestDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/update`, body);
  }

  delete(query: ExactQuery<{ deletedId: string }, { deletedId: true}>, dto: DeleteRequestDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/delete`, body);
  }

  uploadImages(query: Query<Request>, dto: UploadRequestImageDto, files: File[]) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    files.forEach((file) => body.append(FILES_KEY, file, file.name));

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: Query<Request>, dto: DeleteRequestImageDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/deleteImage`, body);
  }
}
