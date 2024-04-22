import { HttpClient } from '@angular/common/http';
import { ApprovePoiDto, CreatePoiDto, DTO_KEY, DenyPoiDto, FILES_KEY, GetPoisByProjectDto, IExactQuery, IPaginate, IPagination, IParser, IQuery, InvolvemintRoutes, PausePoiTimerDto, Poi, PoiCmQuery, PoiSpQuery, QUERY_KEY, ResumePoiTimerDto, StartPoiTimerDto, StopPoiTimerDto, SubmitPoiDto, WithdrawPoiDto, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class PoiRestClient {

  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.poi}`;

  constructor(private http: HttpClient) { }

  get(query: IQuery<Poi[]>) {
    const body = {
      [QUERY_KEY]: query
    };

    return this.http
          .post<IPagination<IParser<Poi, IPaginate & typeof PoiCmQuery>>>(`${this.apiUrl}/get`, body);
  }

  getByProject(query: IQuery<Poi[]>, dto: GetPoisByProjectDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiSpQuery>[]>(`${this.apiUrl}/getByProject`, body);
  }

  create(query: IQuery<Poi>, dto: CreatePoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/create`, body);
  }

  start(query: IQuery<Poi>, dto: StartPoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/start`, body);
  }

  stop(query: IQuery<Poi>, dto: StopPoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/stop`, body);
  }

  withdraw(query: IExactQuery<{ deletedId: string }, { deletedId: true}>, dto: WithdrawPoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/withdraw`, body);
  }

  pause(query: IQuery<Poi>, dto: PausePoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/pause`, body);
  }

  resume(query: IQuery<Poi>, dto: ResumePoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/resume`, body);
  }

  submit(query: IQuery<Poi>, dto: SubmitPoiDto, files: File[]) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto,
      [FILES_KEY]: files
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/submit`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }
  approve(query: IQuery<Poi>, dto: ApprovePoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiSpQuery>>(`${this.apiUrl}/approve`, body);
  }

  deny(query: IQuery<Poi>, dto: DenyPoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiSpQuery>>(`${this.apiUrl}/deny`, body);
  }
}
