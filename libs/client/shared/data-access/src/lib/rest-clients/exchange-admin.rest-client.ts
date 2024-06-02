import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddExchangeAdminDto, BaDownloadEpAdminsQuery, DTO_KEY, EpAdminQuery, ExchangeAdmin, GetExchangeAdminsForExchangePartnerDto, GetSuperAdminForExchangePartnerDto, IParser, IQuery, InvolvemintRoutes, QUERY_KEY, RemoveExchangeAdminDto, environment } from '@involvemint/shared/domain';


@Injectable()
export class ExchangeAdminRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.epAdmin}`;

  constructor(private http: HttpClient) { }

  getForExchangePartner(query: IQuery<ExchangeAdmin>, dto: GetExchangeAdminsForExchangePartnerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangeAdmin, typeof EpAdminQuery>[]>(`${this.apiUrl}/getForExchangePartner`, body);
  }

  getSuperAdminForExchangePartner(query: IQuery<ExchangeAdmin>, dto: GetSuperAdminForExchangePartnerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangeAdmin, typeof BaDownloadEpAdminsQuery>>(`${this.apiUrl}/getSuperAdminForExchangePartner`, body);
  }

  addAdmin(query: IQuery<ExchangeAdmin>, dto: AddExchangeAdminDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangeAdmin, typeof EpAdminQuery>>(`${this.apiUrl}/addAdmin`, body);
  }

  removeAdmin(query: IQuery<{ deletedId: string }>, dto: RemoveExchangeAdminDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/removeAdmin`, body);
  }
}
