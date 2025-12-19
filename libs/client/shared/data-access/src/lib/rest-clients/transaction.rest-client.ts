import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DTO_KEY, environment, GetTransactionsForProfileDto, InvolvemintRoutes, IParser, IQuery, QUERY_KEY, Transaction, TransactionDto, TransactionQuery } from '@involvemint/shared/domain';

@Injectable()
export class TransactionRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.transaction}`;

  constructor(private http: HttpClient) { }
  
  getForProfile(query: IQuery<Transaction>, dto: GetTransactionsForProfileDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Transaction, typeof TransactionQuery>[]>(`${this.apiUrl}/getForProfile`, body);
  }

  transaction(query: IQuery<Transaction>, dto: TransactionDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Transaction, typeof TransactionQuery>>(`${this.apiUrl}/transaction`, body);
  }
}
