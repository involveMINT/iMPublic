import { IEnrollmentOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import {
  createNestjsTestOrchestration,
  ITestOrchestration,
  TestOperation,
  TestOrchestration,
} from '@orcha/testing';

@TestOrchestration(InvolvemintOrchestrations.enrollment)
export class EnrollmentOrchestration implements ITestOrchestration<IEnrollmentOrchestration> {
  @TestOperation()
  get!: ITestOrchestration<IEnrollmentOrchestration>['get'];
  @TestOperation()
  startApplication!: ITestOrchestration<IEnrollmentOrchestration>['startApplication'];
  @TestOperation()
  withdraw!: ITestOrchestration<IEnrollmentOrchestration>['withdraw'];
  @TestOperation()
  linkPassportDocument!: ITestOrchestration<IEnrollmentOrchestration>['linkPassportDocument'];
  @TestOperation()
  submitApplication!: ITestOrchestration<IEnrollmentOrchestration>['submitApplication'];
  @TestOperation()
  acceptWaiver!: ITestOrchestration<IEnrollmentOrchestration>['acceptWaiver'];
  @TestOperation()
  processEnrollmentApplication!: ITestOrchestration<IEnrollmentOrchestration>['processEnrollmentApplication'];
  @TestOperation()
  revertEnrollmentApplication!: ITestOrchestration<IEnrollmentOrchestration>['revertEnrollmentApplication'];
  @TestOperation()
  retireEnrollment!: ITestOrchestration<IEnrollmentOrchestration>['retireEnrollment'];
}

export function createEnrollmentOrchestration(app: INestApplication) {
  return createNestjsTestOrchestration(app, EnrollmentOrchestration);
}
