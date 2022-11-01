import { IChangeMakerOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.changeMaker)
export class ChangeMakerOrchestration implements IClientOrchestration<IChangeMakerOrchestration> {
  @ClientOperation()
  createProfile!: IClientOrchestration<IChangeMakerOrchestration>['createProfile'];
  @ClientOperation()
  editProfile!: IClientOrchestration<IChangeMakerOrchestration>['editProfile'];
  @ClientOperation()
  updateProfileImage!: IClientOrchestration<IChangeMakerOrchestration>['updateProfileImage'];
}
