import { IExchangePartnerOrchestration, InvolvemintRoutes } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintRoutes.exchangePartner)
export class ExchangePartnerOrchestration implements IClientOrchestration<IExchangePartnerOrchestration> {
  @ClientOperation()
  query!: IClientOrchestration<IExchangePartnerOrchestration>['query'];
  @ClientOperation()
  getOne!: IClientOrchestration<IExchangePartnerOrchestration>['getOne'];
  @ClientOperation()
  searchEps!: IClientOrchestration<IExchangePartnerOrchestration>['searchEps'];
  @ClientOperation()
  editProfile!: IClientOrchestration<IExchangePartnerOrchestration>['editProfile'];
  @ClientOperation()
  updateLogoFile!: IClientOrchestration<IExchangePartnerOrchestration>['updateLogoFile'];
  @ClientOperation()
  uploadImages!: IClientOrchestration<IExchangePartnerOrchestration>['uploadImages'];
  @ClientOperation()
  deleteImage!: IClientOrchestration<IExchangePartnerOrchestration>['deleteImage'];
}
