import { InvolvemintOrchestrations, IStorageOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.storage)
export class StorageOrchestration implements IClientOrchestration<IStorageOrchestration> {
  @ClientOperation()
  getUrl!: IClientOrchestration<IStorageOrchestration>['getUrl'];
}
