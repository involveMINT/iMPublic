import { HttpClient } from '@angular/common/http';
import { ApprovePoiDto, CreatePoiDto, DTO_KEY, DenyPoiDto, FILES_KEY, GetPoisByProjectDto, ExactQuery, IPaginate, IPagination, IParser, Query, InvolvemintRoutes, PausePoiTimerDto, Poi, PoiCmQuery, PoiSpQuery, QUERY_KEY, ResumePoiTimerDto, StartPoiTimerDto, StopPoiTimerDto, SubmitPoiDto, WithdrawPoiDto, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class PoiRestClient {

  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.poi}`;

  constructor(private http: HttpClient) { }

  get(query: Query<Poi[]>) {
    const body = {
      [QUERY_KEY]: query
    };

    return this.http
          .post<IPagination<IParser<Poi, IPaginate & typeof PoiCmQuery>>>(`${this.apiUrl}/get`, body);
  }

  getByProject(query: Query<Poi[]>, dto: GetPoisByProjectDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiSpQuery>[]>(`${this.apiUrl}/getByProject`, body);
  }

  create(query: Query<Poi>, dto: CreatePoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/create`, body);
  }

  start(query: Query<Poi>, dto: StartPoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/start`, body);
  }

  stop(query: Query<Poi>, dto: StopPoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/stop`, body);
  }

  withdraw(query: ExactQuery<{ deletedId: string }, { deletedId: true}>, dto: WithdrawPoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: true }>>(`${this.apiUrl}/withdraw`, body);
  }

  pause(query: Query<Poi>, dto: PausePoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/pause`, body);
  }

  resume(query: Query<Poi>, dto: ResumePoiTimerDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/resume`, body);
  }

  submit(query: Query<Poi>, dto: SubmitPoiDto, files: File[]) {
    const body = new FormData();
    body.set(QUERY_KEY, JSON.stringify(query));
    body.set(DTO_KEY, JSON.stringify(dto));
    files.forEach((file) => body.append(FILES_KEY, file, file.name));

    return this.http
          .post<IParser<Poi, typeof PoiCmQuery>>(`${this.apiUrl}/submit`, body, {
            reportProgress: true,
            observe: 'events',
          });
  }
  approve(query: Query<Poi>, dto: ApprovePoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiSpQuery>>(`${this.apiUrl}/approve`, body);
  }

  deny(query: Query<Poi>, dto: DenyPoiDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Poi, typeof PoiSpQuery>>(`${this.apiUrl}/deny`, body);
  }
}
