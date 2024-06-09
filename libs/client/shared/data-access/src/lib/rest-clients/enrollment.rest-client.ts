import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AcceptWaiverDto, DTO_KEY, Enrollment, EnrollmentsQuery, EnrollmentsSpQuery, GetEnrollmentsBySpProject, IParser, IQuery, InvolvemintRoutes, LinkPassportDocumentDto, ProcessEnrollmentApplicationDto, QUERY_KEY, RetireEnrollmentDto, RevertEnrollmentApplicationDto, StartEnrollmentApplicationDto, SubmitEnrollmentApplicationDto, WithdrawEnrollmentApplicationDto, environment } from '@involvemint/shared/domain';
import { Observable } from 'rxjs';

@Injectable()
export class EnrollmentRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.enrollment}`;

  constructor(private http: HttpClient) { }
  
  get(query: IQuery<Enrollment>): Observable<IParser<Enrollment, typeof EnrollmentsQuery>[]>
  {
    const body = {
      [QUERY_KEY]: query
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsQuery>[]>(`${this.apiUrl}/get`, body);
  }

  getBySpProject(query: IQuery<Enrollment>, dto: GetEnrollmentsBySpProject)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsSpQuery>[]>(`${this.apiUrl}/getBySpProject`, body);
  }


  startApplication(query: IQuery<Enrollment>, dto: StartEnrollmentApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsQuery>>(`${this.apiUrl}/startApplication`, body);
  }

  withdraw(query: IQuery<{ deletedId: string }>, dto: WithdrawEnrollmentApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ deletedId: string }, { deletedId: string }>>(`${this.apiUrl}/withdraw`, body);
  }

  linkPassportDocument(query: IQuery<Enrollment>, dto: LinkPassportDocumentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsQuery>>(`${this.apiUrl}/linkPassportDocument`, body);
  }

  submitApplication(query: IQuery<Enrollment>, dto: SubmitEnrollmentApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsQuery>>(`${this.apiUrl}/submitApplication`, body);
  }

  acceptWaiver(query: IQuery<Enrollment>, dto: AcceptWaiverDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsQuery>>(`${this.apiUrl}/acceptWaiver`, body);
  }

  processEnrollmentApplication(query: IQuery<Enrollment>, dto: ProcessEnrollmentApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsSpQuery>>(`${this.apiUrl}/processEnrollmentApplication`, body);
  }

  revertEnrollmentApplication(query: IQuery<Enrollment>, dto: RevertEnrollmentApplicationDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsSpQuery>>(`${this.apiUrl}/revertEnrollmentApplication`, body);
  }

  retireEnrollment(query: IQuery<Enrollment>, dto: RetireEnrollmentDto) {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Enrollment, typeof EnrollmentsSpQuery>>(`${this.apiUrl}/retireEnrollment`, body);
  }
}
