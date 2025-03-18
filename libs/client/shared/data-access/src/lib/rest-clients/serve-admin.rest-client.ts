import { HttpClient } from '@angular/common/http';
import { AddServeAdminDto, DTO_KEY, environment, GetServeAdminsForServePartnerDto, IExactQuery, InvolvemintRoutes, IParser, IQuery, QUERY_KEY, RemoveServeAdminDto, ServeAdmin, SpAdminQuery } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class ServeAdminRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.spAdmin}`;

  constructor(private http: HttpClient) { }

  getForServePartner(query: IQuery<ServeAdmin[]>, dto: GetServeAdminsForServePartnerDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ServeAdmin, typeof SpAdminQuery>[]>(`${this.apiUrl}/getForServePartner`, body);
  }

  addAdmin(query: IQuery<ServeAdmin>, dto: AddServeAdminDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ServeAdmin, typeof SpAdminQuery>>(`${this.apiUrl}/addAdmin`, body);
  }

  removeAdmin(query: IExactQuery<{ deletedId: string }, { deletedId: true }>, dto: RemoveServeAdminDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/removeAdmin`, body);
  }
}
