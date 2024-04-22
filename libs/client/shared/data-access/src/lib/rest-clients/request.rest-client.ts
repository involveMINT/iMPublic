import { HttpClient } from '@angular/common/http';
import { CreateRequestDto, DTO_KEY, DeleteRequestDto, DeleteRequestImageDto, FILES_KEY, GetOneRequestDto, GetRequestsForProfileDto, IExactQuery, IPagination, IParser, IQuery, InvolvemintRoutes, QUERY_KEY, QueryRequestsDto, Request, RequestMarketQuery, RequestQuery, UpdateRequestDto, UploadRequestImageDto, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class RequestRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.request}`;

  constructor(private http: HttpClient) { }
  
  query(query: IQuery<Request[]>, dto: QueryRequestsDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IPagination<IParser<Request, typeof RequestMarketQuery>>>(`${this.apiUrl}/query`, body);
  }

  getOne(query: IQuery<Request>, dto: GetOneRequestDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestMarketQuery>>(`${this.apiUrl}/getOne`, body);
  }

  getForProfile(query: IQuery<Request[]>, dto: GetRequestsForProfileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  create(query: IQuery<Request>, dto: CreateRequestDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/create`, body);
  }

  update(query: IQuery<Request>, dto: UpdateRequestDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/update`, body);
  }

  delete(query: IExactQuery<{ deletedId: string }, { deletedId: true}>, dto: DeleteRequestDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/delete`, body);
  }

  uploadImages(query: IQuery<Request>, dto: UploadRequestImageDto, files: File[]) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: files
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: IQuery<Request>, dto: DeleteRequestImageDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Request, typeof RequestQuery>>(`${this.apiUrl}/deleteImage`, body);
  }
}
