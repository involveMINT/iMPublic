import { EnrollmentService } from '@involvemint/server/core/application-services';
import {
  AcceptWaiverDto,
  Enrollment,
  EnrollmentsQuery,
  EnrollmentsSpQuery,
  GetEnrollmentsBySpProject,
  IEnrollmentOrchestration,
  InvolvemintOrchestrations,
  LinkPassportDocumentDto,
  ProcessEnrollmentApplicationDto,
  Project,
  RetireEnrollmentDto,
  RevertEnrollmentApplicationDto,
  StartEnrollmentApplicationDto,
  SubmitEnrollmentApplicationDto,
  WithdrawEnrollmentApplicationDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.enrollment)
export class EnrollmentOrchestration implements IServerOrchestration<IEnrollmentOrchestration> {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @ServerOperation({ validateQuery: EnrollmentsQuery })
  get(query: IQuery<Enrollment[]>, token: string) {
    return this.enrollmentService.get(query, token);
  }

  @ServerOperation({ validateQuery: EnrollmentsSpQuery })
  getBySpProject(query: IQuery<Enrollment[]>, token: string, dto: GetEnrollmentsBySpProject) {
    return this.enrollmentService.getBySpProject(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsQuery })
  startApplication(query: IQuery<Enrollment>, token: string, dto: StartEnrollmentApplicationDto) {
    return this.enrollmentService.startApplication(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  withdraw(query: IQuery<{ deletedId: string }>, token: string, dto: WithdrawEnrollmentApplicationDto) {
    return this.enrollmentService.withdraw(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsQuery })
  linkPassportDocument(query: IQuery<Enrollment>, token: string, dto: LinkPassportDocumentDto) {
    return this.enrollmentService.linkPassportDocument(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsQuery })
  submitApplication(query: IQuery<Enrollment>, token: string, dto: SubmitEnrollmentApplicationDto) {
    return this.enrollmentService.submitApplication(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsQuery })
  acceptWaiver(query: IQuery<Enrollment>, token: string, dto: AcceptWaiverDto) {
    return this.enrollmentService.acceptWaiver(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsSpQuery })
  processEnrollmentApplication(query: IQuery<Project>, token: string, dto: ProcessEnrollmentApplicationDto) {
    return this.enrollmentService.processEnrollmentApplication(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsSpQuery })
  revertEnrollmentApplication(query: IQuery<Project>, token: string, dto: RevertEnrollmentApplicationDto) {
    return this.enrollmentService.revertEnrollmentApplication(query, token, dto);
  }

  @ServerOperation({ validateQuery: EnrollmentsSpQuery })
  retireEnrollment(query: IQuery<Project>, token: string, dto: RetireEnrollmentDto) {
    return this.enrollmentService.retireEnrollment(query, token, dto);
  }
}
