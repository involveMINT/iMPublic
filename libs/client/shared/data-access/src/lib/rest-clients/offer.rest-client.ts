import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOfferDto, DTO_KEY, DeleteOfferDto, FILES_KEY, GetOffersForProfileDto, GetOneOfferDto, IPaginate, IPagination, IParser, Query, InvolvemintRoutes, Offer, OfferMarketQuery, OfferQuery, QUERY_KEY, QueryOffersDto, UpdateOfferDto, UploadOfferImageDto, environment } from '@involvemint/shared/domain';

@Injectable()
export class OfferRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.offer}`;

  constructor(private http: HttpClient) { }
  
  query(query: Query<Offer[]>, dto: QueryOffersDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IPagination<IParser<Offer, IPaginate & typeof OfferMarketQuery>>>(`${this.apiUrl}/query`, body);
  }

  getOne(query: Query<Offer>, dto: GetOneOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferMarketQuery>>(`${this.apiUrl}/getOne`, body);
  }
  getForProfile(query: Query<Offer[]>, dto: GetOffersForProfileDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferMarketQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  create(query: Query<Offer>, dto: CreateOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/create`, body);
  }

  update(query: Query<Offer>, dto: UpdateOfferDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/update`, body);
  }

  delete(query: Query<{ deletedId: string }>, dto: DeleteOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/delete`, body);
  }

  uploadImages(query: Query<Offer>, dto: UploadOfferImageDto, images: File[])
  {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    images.forEach((file) => body.append(FILES_KEY, file, file.name));

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: Query<Offer>, dto: DeleteOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/deleteImage`, body);
  }
}
