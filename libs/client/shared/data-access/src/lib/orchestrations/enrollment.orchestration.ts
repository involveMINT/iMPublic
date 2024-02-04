import { IEnrollmentOrchestration, InvolvemintRoutes } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintRoutes.enrollment)
export class EnrollmentOrchestration implements IClientOrchestration<IEnrollmentOrchestration> {
  @ClientOperation()
  getBySpProject!: IClientOrchestration<IEnrollmentOrchestration>['getBySpProject'];
  @ClientOperation()
  startApplication!: IClientOrchestration<IEnrollmentOrchestration>['startApplication'];
  @ClientOperation()
  withdraw!: IClientOrchestration<IEnrollmentOrchestration>['withdraw'];
  @ClientOperation()
  linkPassportDocument!: IClientOrchestration<IEnrollmentOrchestration>['linkPassportDocument'];
  @ClientOperation()
  submitApplication!: IClientOrchestration<IEnrollmentOrchestration>['submitApplication'];
  @ClientOperation()
  acceptWaiver!: IClientOrchestration<IEnrollmentOrchestration>['acceptWaiver'];
  @ClientOperation()
  processEnrollmentApplication!: IClientOrchestration<IEnrollmentOrchestration>['processEnrollmentApplication'];
  @ClientOperation()
  revertEnrollmentApplication!: IClientOrchestration<IEnrollmentOrchestration>['revertEnrollmentApplication'];
  @ClientOperation()
  retireEnrollment!: IClientOrchestration<IEnrollmentOrchestration>['retireEnrollment'];
}
