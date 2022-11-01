import { InvolvemintOrchestrations, IPassportDocumentOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.passport)
export class PassportDocumentOrchestration implements IClientOrchestration<IPassportDocumentOrchestration> {
  @ClientOperation()
  get!: IClientOrchestration<IPassportDocumentOrchestration>['get'];
  @ClientOperation()
  create!: IClientOrchestration<IPassportDocumentOrchestration>['create'];
  @ClientOperation()
  edit!: IClientOrchestration<IPassportDocumentOrchestration>['edit'];
  @ClientOperation()
  replace!: IClientOrchestration<IPassportDocumentOrchestration>['replace'];
  @ClientOperation()
  delete!: IClientOrchestration<IPassportDocumentOrchestration>['delete'];
}
