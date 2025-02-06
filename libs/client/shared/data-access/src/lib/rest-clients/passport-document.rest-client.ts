import { HttpClient } from '@angular/common/http';
import { DTO_KEY, DeletePassportDocumentDto, EditPassportDocumentDto, FILES_KEY, IParser, Query, InvolvemintRoutes, PassportDocument, PassportDocumentQuery, QUERY_KEY, ReplacePassportDocumentDto, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class PassportDocumentRestClient {

  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.passport}`;

  constructor(private http: HttpClient) { }
  
  get(query: Query<PassportDocument>) {
    const body = {
      [QUERY_KEY]: query
    };

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>[]>(`${this.apiUrl}/get`, body);
  }

  create(query: Query<PassportDocument>, document: File) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(FILES_KEY, document, document.name);

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>>(`${this.apiUrl}/create`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  edit(query: Query<PassportDocument>, dto: EditPassportDocumentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>>(`${this.apiUrl}/edit`, body);
  }

  replace(query: Query<PassportDocument>, dto: ReplacePassportDocumentDto, document: File)
  {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    body.set(FILES_KEY, document, document.name);

    return this.http
          .post<IParser<PassportDocument, typeof PassportDocumentQuery>>(`${this.apiUrl}/replace`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }

  delete(query: Query<{ deletedId: string }>, dto: DeletePassportDocumentDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/delete`, body);
  }
}
