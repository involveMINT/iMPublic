import { HttpClient } from '@angular/common/http';
import { DTO_KEY, DeleteEpImageDto, EditEpProfileDto, ExchangePartner, ExchangePartnerMarketQuery, ExchangePartnerMarketQueryDto, FILES_KEY, GetOneExchangePartnerDto, IParser, IQuery, InvolvemintRoutes, QUERY_KEY, SearchEpDto, UpdateEpLogoFileDto, UserQuery, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class ExchangePartnerRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.exchangePartner}`;

  constructor(private http: HttpClient) { }

  query(query: IQuery<ExchangePartner>, dto: ExchangePartnerMarketQueryDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangePartner, typeof ExchangePartnerMarketQuery>[]>(`${this.apiUrl}/query`, body);
  }

  getOne(query: IQuery<ExchangePartner>, dto: GetOneExchangePartnerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangePartner, typeof ExchangePartnerMarketQuery>>(`${this.apiUrl}/getOne`, body);
  }

  searchEps(query: IQuery<ExchangePartner>, dto: SearchEpDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangePartner, typeof ExchangePartnerMarketQuery>>(`${this.apiUrl}/searchEps`, body);
  }

  editProfile(query: IQuery<ExchangePartner>, dto: EditEpProfileDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangePartner, typeof UserQuery.exchangeAdmins.exchangePartner>>(`${this.apiUrl}/editProfile`, body);
  }

  updateLogoFile(query: IQuery<ExchangePartner>, dto: UpdateEpLogoFileDto, image: File) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    body.set(FILES_KEY, image, image.name);

    return this.http
          .post<IParser<ExchangePartner, typeof UserQuery.exchangeAdmins.exchangePartner>>(`${this.apiUrl}/updateLogoFile`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  uploadImages(query: IQuery<ExchangePartner>, dto: UpdateEpLogoFileDto, images: File[]) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    images.forEach((file) => body.append(FILES_KEY, file, file.name));

    return this.http
          .post<IParser<ExchangePartner, typeof UserQuery.exchangeAdmins.exchangePartner>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: IQuery<ExchangePartner>, dto: DeleteEpImageDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangePartner, typeof UserQuery.exchangeAdmins.exchangePartner>>(`${this.apiUrl}/deleteImage`, body);
  }
}
