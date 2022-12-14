import { InvolvemintOrchestrations, IServePartnerOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.servePartner)
export class ServePartnerOrchestration implements IClientOrchestration<IServePartnerOrchestration> {
  @ClientOperation()
  editProfile!: IClientOrchestration<IServePartnerOrchestration>['editProfile'];
  @ClientOperation()
  updateLogoFile!: IClientOrchestration<IServePartnerOrchestration>['updateLogoFile'];
  @ClientOperation()
  uploadImages!: IClientOrchestration<IServePartnerOrchestration>['uploadImages'];
  @ClientOperation()
  deleteImage!: IClientOrchestration<IServePartnerOrchestration>['deleteImage'];
}
