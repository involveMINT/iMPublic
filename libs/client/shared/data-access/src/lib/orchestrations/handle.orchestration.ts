import { IHandleOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.handle)
export class HandleOrchestration implements IClientOrchestration<IHandleOrchestration> {
  @ClientOperation()
  verifyHandle!: IClientOrchestration<IHandleOrchestration>['verifyHandle'];
  @ClientOperation()
  searchHandles!: IClientOrchestration<IHandleOrchestration>['searchHandles'];
  @ClientOperation()
  viewProfile!: IClientOrchestration<IHandleOrchestration>['viewProfile'];
  @ClientOperation()
  genericSearch!: IClientOrchestration<IHandleOrchestration>['genericSearch'];
}
