import { IChatOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.chat)
export class ChatOrchestration implements IClientOrchestration<IChatOrchestration> {
  @ClientOperation()
  sendMessage!: IClientOrchestration<IChatOrchestration>['sendMessage'];
}
