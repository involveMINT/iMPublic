import { IEpApplicationOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.epApplication)
export class EpApplicationOrchestration implements IClientOrchestration<IEpApplicationOrchestration> {
  @ClientOperation()
  submit!: IClientOrchestration<IEpApplicationOrchestration>['submit'];
  @ClientOperation()
  baSubmit!: IClientOrchestration<IEpApplicationOrchestration>['baSubmit'];
  @ClientOperation()
  process!: IClientOrchestration<IEpApplicationOrchestration>['process'];
  @ClientOperation()
  findAll!: IClientOrchestration<IEpApplicationOrchestration>['findAll'];
  @ClientOperation()
  withdraw!: IClientOrchestration<IEpApplicationOrchestration>['withdraw'];
}
