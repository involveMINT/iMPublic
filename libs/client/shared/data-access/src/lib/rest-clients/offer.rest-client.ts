import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOfferDto, DTO_KEY, DeleteOfferDto, FILES_KEY, GetOffersForProfileDto, GetOneOfferDto, IPaginate, IPagination, IParser, IQuery, InvolvemintRoutes, Offer, OfferMarketQuery, OfferQuery, QUERY_KEY, QueryOffersDto, UpdateOfferDto, UploadOfferImageDto, environment } from '@involvemint/shared/domain';

@Injectable()
export class OfferRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.offer}`;

  constructor(private http: HttpClient) { }
  
  query(query: IQuery<Offer[]>, dto: QueryOffersDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IPagination<IParser<Offer, IPaginate & typeof OfferMarketQuery>>>(`${this.apiUrl}/query`, body);
  }

  getOne(query: IQuery<Offer>, dto: GetOneOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferMarketQuery>>(`${this.apiUrl}/getOne`, body);
  }
  getForProfile(query: IQuery<Offer[]>, dto: GetOffersForProfileDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferMarketQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  create(query: IQuery<Offer>, dto: CreateOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/create`, body);
  }

  update(query: IQuery<Offer>, dto: UpdateOfferDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/update`, body);
  }

  delete(query: IQuery<{ deletedId: string }>, dto: DeleteOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/delete`, body);
  }

  uploadImages(query: IQuery<Offer>, dto: UploadOfferImageDto, images: File[])
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: images
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/uploadImages`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  deleteImage(query: IQuery<Offer>, dto: DeleteOfferDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Offer, typeof OfferQuery>>(`${this.apiUrl}/deleteImage`, body);
  }
}
