import { HttpClient } from '@angular/common/http';
import { DTO_KEY, environment, IExactQuery, InvolvemintRoutes, IParser, IQuery, ProcessSpApplicationDto, QUERY_KEY, SpApplication, SpApplicationQuery, SubmitSpApplicationDto, UserQuery, WithdrawSpApplicationDto } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class SpApplicationRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.spApplication}`;

  constructor(private http: HttpClient) { }

  submit(query: IQuery<SpApplication>, dto: SubmitSpApplicationDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<SpApplication, typeof UserQuery.spApplications>>(`${this.apiUrl}/submit`, body);
  }

  process(query: IExactQuery<{ deletedId: string }, { deletedId: true }>, dto: ProcessSpApplicationDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/process`, body);
  }

  findAll(query: IQuery<SpApplication[]>)
  {
    const body = {
      [QUERY_KEY]: query,
    };

    return this.http
          .post<IParser<SpApplication, typeof SpApplicationQuery>[]>(`${this.apiUrl}/findAll`, body);
  }

  withdraw(query: IExactQuery<{ deletedId: string }, { deletedId: true }>, dto: WithdrawSpApplicationDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/withdraw`, body);
  }
}
