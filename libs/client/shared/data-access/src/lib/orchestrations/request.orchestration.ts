import { InvolvemintRoutes, IRequestOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintRoutes.request)
export class RequestOrchestration implements IClientOrchestration<IRequestOrchestration> {
  @ClientOperation()
  query!: IClientOrchestration<IRequestOrchestration>['query'];
  @ClientOperation()
  getOne!: IClientOrchestration<IRequestOrchestration>['getOne'];
  @ClientOperation()
  getForProfile!: IClientOrchestration<IRequestOrchestration>['getForProfile'];
  @ClientOperation()
  create!: IClientOrchestration<IRequestOrchestration>['create'];
  @ClientOperation()
  update!: IClientOrchestration<IRequestOrchestration>['update'];
  @ClientOperation()
  delete!: IClientOrchestration<IRequestOrchestration>['delete'];
  @ClientOperation()
  uploadImages!: IClientOrchestration<IRequestOrchestration>['uploadImages'];
  @ClientOperation()
  deleteImage!: IClientOrchestration<IRequestOrchestration>['deleteImage'];
}
