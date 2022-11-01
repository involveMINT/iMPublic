import { InvolvemintOrchestrations, IServeAdminOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.spAdmin)
export class ServeAdminOrchestration implements IClientOrchestration<IServeAdminOrchestration> {
  @ClientOperation()
  getForServePartner!: IClientOrchestration<IServeAdminOrchestration>['getForServePartner'];
  @ClientOperation()
  addAdmin!: IClientOrchestration<IServeAdminOrchestration>['addAdmin'];
  @ClientOperation()
  removeAdmin!: IClientOrchestration<IServeAdminOrchestration>['removeAdmin'];
}
