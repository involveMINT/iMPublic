import { IOperation } from '@orcha/common';
import {
  AcceptWaiverDto,
  GetEnrollmentsBySpProject,
  LinkPassportDocumentDto,
  ProcessEnrollmentApplicationDto,
  RetireEnrollmentDto,
  RevertEnrollmentApplicationDto,
  SearchForEnrollmentsDto,
  StartEnrollmentApplicationDto,
  SubmitEnrollmentApplicationDto,
  WithdrawEnrollmentApplicationDto,
} from './enrollment.dtos';
import { Enrollment } from './enrollment.model';

export interface IEnrollmentOrchestration {
  searchForEnrollments: IOperation<Enrollment[], SearchForEnrollmentsDto>;
  get: IOperation<Enrollment[]>;
  getBySpProject: IOperation<Enrollment[], GetEnrollmentsBySpProject>;
  startApplication: IOperation<Enrollment, StartEnrollmentApplicationDto>;
  withdraw: IOperation<{ deletedId: string }, WithdrawEnrollmentApplicationDto>;
  linkPassportDocument: IOperation<Enrollment, LinkPassportDocumentDto>;
  submitApplication: IOperation<Enrollment, SubmitEnrollmentApplicationDto>;
  acceptWaiver: IOperation<Enrollment, AcceptWaiverDto>;
  processEnrollmentApplication: IOperation<Enrollment, ProcessEnrollmentApplicationDto>;
  revertEnrollmentApplication: IOperation<Enrollment, RevertEnrollmentApplicationDto>;
  retireEnrollment: IOperation<Enrollment, RetireEnrollmentDto>;
}
