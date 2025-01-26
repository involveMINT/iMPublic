import { InvolvemintOrchestrations, IUserOrchestration } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import {
  createNestjsTestOrchestration,
  ITestOrchestration,
  TestOperation,
  TestOrchestration,
} from '@orcha/testing';

@TestOrchestration(InvolvemintOrchestrations.user)
class UserOrchestration implements ITestOrchestration<IUserOrchestration> {
  @TestOperation()
  verifyUserEmail!: ITestOrchestration<IUserOrchestration>['verifyUserEmail'];
  @TestOperation()
  signUp!: ITestOrchestration<IUserOrchestration>['signUp'];
  @TestOperation()
  login!: ITestOrchestration<IUserOrchestration>['login'];
  @TestOperation()
  adminLogin!: ITestOrchestration<IUserOrchestration>['adminLogin'];
  @TestOperation()
  validateAdminToken!: ITestOrchestration<IUserOrchestration>['validateAdminToken'];
  @TestOperation()
  getUserData!: ITestOrchestration<IUserOrchestration>['getUserData'];
  @TestOperation()
  snoop!: ITestOrchestration<IUserOrchestration>['snoop'];
  @TestOperation()
  getAllUserPrivileges!: ITestOrchestration<IUserOrchestration>['getAllUserPrivileges'];
  @TestOperation()
  grantBAPrivilege!: ITestOrchestration<IUserOrchestration>['grantBAPrivilege'];
  @TestOperation()
  revokeBAPrivilege!: ITestOrchestration<IUserOrchestration>['revokeBAPrivilege'];
  @TestOperation()
  searchUsers!: ITestOrchestration<IUserOrchestration>['searchUsers'];
  @TestOperation()
  activateUserAccount!: ITestOrchestration<IUserOrchestration>['activateUserAccount'];
  @TestOperation()
  resendEmailVerificationEmail!: ITestOrchestration<IUserOrchestration>['resendEmailVerificationEmail'];
  @TestOperation()
  verifyEmail!: ITestOrchestration<IUserOrchestration>['verifyEmail'];
  @TestOperation()
  forgotPassword!: ITestOrchestration<IUserOrchestration>['forgotPassword'];
  @TestOperation()
  forgotPasswordChange!: ITestOrchestration<IUserOrchestration>['forgotPasswordChange'];
  @TestOperation()
  changePassword!: ITestOrchestration<IUserOrchestration>['changePassword'];
  @TestOperation()
  finishJoyride!: ITestOrchestration<IUserOrchestration>['finishJoyride'];
  @TestOperation()
  adminUserSearch!: ITestOrchestration<IUserOrchestration>['adminUserSearch'];
}

export function createUserOrchestration(app: INestApplication) {
  return createNestjsTestOrchestration(app, UserOrchestration);
}
