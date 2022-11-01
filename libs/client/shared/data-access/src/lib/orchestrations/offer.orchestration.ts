import { InvolvemintOrchestrations, IOfferOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.offer)
export class OfferOrchestration implements IClientOrchestration<IOfferOrchestration> {
  @ClientOperation()
  query!: IClientOrchestration<IOfferOrchestration>['query'];
  @ClientOperation()
  getOne!: IClientOrchestration<IOfferOrchestration>['getOne'];
  @ClientOperation()
  getForProfile!: IClientOrchestration<IOfferOrchestration>['getForProfile'];
  @ClientOperation()
  create!: IClientOrchestration<IOfferOrchestration>['create'];
  @ClientOperation()
  update!: IClientOrchestration<IOfferOrchestration>['update'];
  @ClientOperation()
  delete!: IClientOrchestration<IOfferOrchestration>['delete'];
  @ClientOperation()
  uploadImages!: IClientOrchestration<IOfferOrchestration>['uploadImages'];
  @ClientOperation()
  deleteImage!: IClientOrchestration<IOfferOrchestration>['deleteImage'];
}
