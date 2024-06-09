import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaSubmitEpApplicationDto, DTO_KEY, EpApplication, EpApplicationQuery, ExchangePartner, IParser, IQuery, InvolvemintRoutes, ProcessEpApplicationDto, QUERY_KEY, SubmitEpApplicationDto, WithdrawEpApplicationDto, environment } from '@involvemint/shared/domain';


@Injectable()
export class EpApplicationRestClient {

  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.epApplication}`;

  constructor(private http: HttpClient) { }
  
  submit(query: IQuery<EpApplication>, dto: SubmitEpApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<EpApplication, typeof EpApplicationQuery>>(`${this.apiUrl}/submit`, body);
  }

  baSubmit(query: IQuery<ExchangePartner>, dto: BaSubmitEpApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ExchangePartner, typeof EpApplicationQuery>>(`${this.apiUrl}/baSubmit`, body);
  }

  process(query: IQuery<{ deletedId: string }>, dto: ProcessEpApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/process`, body);
  }

  findAll(query: IQuery<EpApplication[]>) {
    const body = {
      [QUERY_KEY]: query
    };

    return this.http
          .post<IParser<EpApplication, typeof EpApplicationQuery>[]>(`${this.apiUrl}/findAll`, body);
  }

  withdraw(query: IQuery<{ deletedId: string }>, dto: WithdrawEpApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/withdraw`, body);
  }
}
