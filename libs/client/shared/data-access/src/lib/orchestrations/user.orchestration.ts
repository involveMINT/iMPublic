import { InvolvemintOrchestrations, IUserOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.user)
export class UserOrchestration implements IClientOrchestration<IUserOrchestration> {
  @ClientOperation()
  verifyUserEmail!: IClientOrchestration<IUserOrchestration>['verifyUserEmail'];
  @ClientOperation()
  signUp!: IClientOrchestration<IUserOrchestration>['signUp'];
  @ClientOperation()
  login!: IClientOrchestration<IUserOrchestration>['login'];
  @ClientOperation()
  adminLogin!: IClientOrchestration<IUserOrchestration>['adminLogin'];
  @ClientOperation()
  validateAdminToken!: IClientOrchestration<IUserOrchestration>['validateAdminToken'];
  @ClientOperation()
  getUserData!: IClientOrchestration<IUserOrchestration>['getUserData'];
  @ClientOperation()
  snoop!: IClientOrchestration<IUserOrchestration>['snoop'];
  @ClientOperation()
  getAllUserPrivileges!: IClientOrchestration<IUserOrchestration>['getAllUserPrivileges'];
  @ClientOperation()
  grantBAPrivilege!: IClientOrchestration<IUserOrchestration>['grantBAPrivilege'];
  @ClientOperation()
  revokeBAPrivilege!: IClientOrchestration<IUserOrchestration>['revokeBAPrivilege'];
  @ClientOperation()
  searchUsers!: IClientOrchestration<IUserOrchestration>['searchUsers'];
  @ClientOperation()
  activateUserAccount!: IClientOrchestration<IUserOrchestration>['activateUserAccount'];
  @ClientOperation()
  resendEmailVerificationEmail!: IClientOrchestration<IUserOrchestration>['resendEmailVerificationEmail'];
  @ClientOperation()
  verifyEmail!: IClientOrchestration<IUserOrchestration>['verifyEmail'];
  @ClientOperation()
  forgotPassword!: IClientOrchestration<IUserOrchestration>['forgotPassword'];
  @ClientOperation()
  forgotPasswordChange!: IClientOrchestration<IUserOrchestration>['forgotPasswordChange'];
  @ClientOperation()
  changePassword!: IClientOrchestration<IUserOrchestration>['changePassword'];
  @ClientOperation()
  finishJoyride!: IClientOrchestration<IUserOrchestration>['finishJoyride'];
  @ClientOperation()
  changeForDonation!: IClientOrchestration<IUserOrchestration>['changeForDonation'];
  @ClientOperation()
  adminUserSearch!: IClientOrchestration<IUserOrchestration>['adminUserSearch'];
}
