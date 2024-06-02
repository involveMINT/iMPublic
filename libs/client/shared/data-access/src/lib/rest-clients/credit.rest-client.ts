import { HttpClient } from '@angular/common/http';
import { Credit, CreditQuery, DTO_KEY, GetCreditsForProfileDto, IParser, IParserObject, IQuery, InvolvemintRoutes, MintDto, QUERY_KEY, environment } from '@involvemint/shared/domain';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class CreditRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.credit}`;

  constructor(private http: HttpClient) { }

  getCreditsForProfile(creditQuery: IQuery<Credit[]>, dto: GetCreditsForProfileDto)
  {
    const body = {
      [QUERY_KEY]: creditQuery,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Credit[], typeof CreditQuery>>(`${this.apiUrl}/getCreditsForProfile`, body);
  }

  mint(query: Record<string, never>, dto: MintDto): Observable<IParserObject<Record<string, never>, Record<string, never>>>
  {
    const body = {
      [QUERY_KEY]:query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParserObject<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/mint`, body);
  }
}
