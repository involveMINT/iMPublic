import { IChatOrchestration, InvolvemintRoutes } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintRoutes.chat)
export class ChatOrchestration implements IClientOrchestration<IChatOrchestration> {
  @ClientOperation()
  sendMessage!: IClientOrchestration<IChatOrchestration>['sendMessage'];
}
