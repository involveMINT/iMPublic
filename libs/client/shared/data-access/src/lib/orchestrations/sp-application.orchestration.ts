import { InvolvemintOrchestrations, ISpApplicationOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.spApplication)
export class SpApplicationOrchestration implements IClientOrchestration<ISpApplicationOrchestration> {
  @ClientOperation()
  submit!: IClientOrchestration<ISpApplicationOrchestration>['submit'];
  @ClientOperation()
  process!: IClientOrchestration<ISpApplicationOrchestration>['process'];
  @ClientOperation()
  findAll!: IClientOrchestration<ISpApplicationOrchestration>['findAll'];
  @ClientOperation()
  withdraw!: IClientOrchestration<ISpApplicationOrchestration>['withdraw'];
}
