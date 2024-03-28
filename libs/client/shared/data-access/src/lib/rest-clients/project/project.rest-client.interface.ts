import { InvolvemintRoutes, IProjectOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintRoutes.project)
export class ProjectOrchestration implements IClientOrchestration<IProjectOrchestration> {
  @ClientOperation()
  getAll!: IClientOrchestration<IProjectOrchestration>['getAll'];
  @ClientOperation()
  getOne!: IClientOrchestration<IProjectOrchestration>['getOne'];
  @ClientOperation()
  getAllOwnedBySp!: IClientOrchestration<IProjectOrchestration>['getAllOwnedBySp'];
  @ClientOperation()
  create!: IClientOrchestration<IProjectOrchestration>['create'];
  @ClientOperation()
  update!: IClientOrchestration<IProjectOrchestration>['update'];
  @ClientOperation()
  uploadImages!: IClientOrchestration<IProjectOrchestration>['uploadImages'];
  @ClientOperation()
  deleteImage!: IClientOrchestration<IProjectOrchestration>['deleteImage'];
  @ClientOperation()
  delete!: IClientOrchestration<IProjectOrchestration>['delete'];
  @ClientOperation()
  uploadCustomWaiver!: IClientOrchestration<IProjectOrchestration>['uploadCustomWaiver'];
}
