import { HttpClient } from '@angular/common/http';
import { DTO_KEY, DeletePassportDocumentDto, EditPassportDocumentDto, FILES_KEY, IParser, IQuery, InvolvemintRoutes, PassportDocument, PassportDocumentQuery, QUERY_KEY, ReplacePassportDocumentDto, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class PassportDocumentRestClient {

  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.passport}`;

  constructor(private http: HttpClient) { }
  
  get(query: IQuery<PassportDocument>) {
    const body = {
      [QUERY_KEY]: query
    };

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>[]>(`${this.apiUrl}/get`, body);
  }

  create(query: IQuery<PassportDocument>, document: File) {
    const body = {
      [QUERY_KEY]: query,
      [FILES_KEY]: document
    };

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>>(`${this.apiUrl}/create`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  edit(query: IQuery<PassportDocument>, dto: EditPassportDocumentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>>(`${this.apiUrl}/edit`, body);
  }

  replace(query: IQuery<PassportDocument>, dto: ReplacePassportDocumentDto, document: File)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: document
    };

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>>(`${this.apiUrl}/replace`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  delete(query: IQuery<{ deletedId: string }>, dto: DeletePassportDocumentDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/delete`, body);
  }
}
