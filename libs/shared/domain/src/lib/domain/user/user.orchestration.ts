/* eslint-disable @typescript-eslint/ban-types */
import { IOperation } from '@orcha/common';
import {
  ActivateUserAccountDto,
  AdminLoginDto,
  AdminUserSearchDto,
  ChangePasswordDto,
  ForgotPasswordChangeDto,
  ForgotPasswordDto,
  GrantBaPrivilegesDto,
  LoginDto,
  ResendEmailVerificationEmailDto,
  RevokeBaPrivilegesDto,
  SearchUserDto,
  SignUpDto,
  SnoopDto,
  ValidateAdminDto,
  VerifyEmailDto,
  VerifyUserEmailDto,
} from './user.dtos';
import { ISnoopData, User } from './user.model';

export interface IUserOrchestration {
  verifyUserEmail: IOperation<{ isUnique: boolean }, VerifyUserEmailDto>;
  signUp: IOperation<{ token: string }, SignUpDto>;
  login: IOperation<{ token: string }, LoginDto>;
  adminLogin: IOperation<{ token: string }, AdminLoginDto>;
  validateAdminToken: IOperation<{ token: string }, ValidateAdminDto>;
  getUserData: IOperation<User>;
  snoop: IOperation<ISnoopData, SnoopDto>;
  getAllUserPrivileges: IOperation<User[]>;
  grantBAPrivilege: IOperation<User, GrantBaPrivilegesDto>;
  revokeBAPrivilege: IOperation<User, RevokeBaPrivilegesDto>;
  searchUsers: IOperation<User[], SearchUserDto>;
  activateUserAccount: IOperation<{}, ActivateUserAccountDto>;
  resendEmailVerificationEmail: IOperation<{}, ResendEmailVerificationEmailDto>;
  verifyEmail: IOperation<{}, VerifyEmailDto>;
  forgotPassword: IOperation<{}, ForgotPasswordDto>;
  forgotPasswordChange: IOperation<{}, ForgotPasswordChangeDto>;
  changePassword: IOperation<{}, ChangePasswordDto>;
  finishJoyride: IOperation<{}, undefined>;
  adminUserSearch: IOperation<User[], AdminUserSearchDto>;
}
