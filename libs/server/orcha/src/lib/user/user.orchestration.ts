/* eslint-disable @typescript-eslint/ban-types */
import { AuthService, UserService } from '@involvemint/server/core/application-services';
import {
  ActivateUserAccountDto,
  AdminLoginDto,
  AdminLoginQuery,
  AdminUserSearchDto,
  ChangePasswordDto,
  ForgotPasswordChangeDto,
  ForgotPasswordDto,
  GrantBaPrivilegesDto,
  InvolvemintOrchestrations,
  ISnoopData,
  IUserOrchestration,
  LoginDto,
  LoginQuery,
  ResendEmailVerificationEmailDto,
  RevokeBaPrivilegesDto,
  SearchUserDto,
  SignUpDto,
  SignUpQuery,
  SnoopDto,
  SnoopQuery,
  User,
  UserPrivilegeQuery,
  UserQuery,
  UserSearchQuery,
  ValidateAdminDto,
  ValidateAdminTokenQuery,
  VerifyEmailDto,
  VerifyUserEmailDto,
  VerifyUserEmailQuery,
} from '@involvemint/shared/domain';
import { IQuery, parseQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.user)
export class UserOrchestration implements IServerOrchestration<IUserOrchestration> {
  constructor(private readonly auth: AuthService, private readonly user: UserService) {}

  @ServerOperation({ validateQuery: VerifyUserEmailQuery })
  async verifyUserEmail(query: IQuery<{ isUnique: boolean }>, _: string, { email }: VerifyUserEmailDto) {
    return parseQuery(query, { isUnique: await this.user.verifyUserEmail(email) });
  }

  @ServerOperation({ validateQuery: SignUpQuery })
  async signUp(query: IQuery<{ token: string }>, _: string, dto: SignUpDto) {
    return this.user.signUp(dto, query);
  }

  @ServerOperation({ validateQuery: LoginQuery })
  async login(query: IQuery<{ token: string }>, _: string, { id, password }: LoginDto) {
    return this.user.login(id, password, query);
  }

  @ServerOperation({ validateQuery: AdminLoginQuery })
  async adminLogin(query: IQuery<{ token: string }>, _: string, { password }: AdminLoginDto) {
    return this.user.adminLogin(password, query);
  }

  @ServerOperation({ validateQuery: ValidateAdminTokenQuery })
  async validateAdminToken(query: IQuery<{ token: string }>, _: string, { token }: ValidateAdminDto) {
    return this.user.validateAdminToken(query, token);
  }

  @ServerOperation({ validateQuery: UserQuery })
  async getUserData(query: IQuery<User>, token: string) {
    return this.user.getUserData(query, token);
  }

  @ServerOperation({ validateQuery: SnoopQuery })
  async snoop(query: IQuery<ISnoopData>, token: string, dto: SnoopDto) {
    return this.user.snoop(query, token, dto);
  }

  @ServerOperation({ validateQuery: UserPrivilegeQuery })
  async getAllUserPrivileges(query: IQuery<User[]>, token: string) {
    return this.user.getAllUserPrivileges(query, token);
  }

  @ServerOperation()
  async grantBAPrivilege(query: IQuery<User>, token: string, dto: GrantBaPrivilegesDto) {
    return this.user.grantBAPrivilege(query, token, dto);
  }

  @ServerOperation()
  async revokeBAPrivilege(query: IQuery<User>, token: string, dto: RevokeBaPrivilegesDto) {
    return this.user.revokeBAPrivilege(query, token, dto);
  }

  @ServerOperation({ validateQuery: UserSearchQuery })
  async searchUsers(query: IQuery<User[]>, _: string, dto: SearchUserDto) {
    return this.user.searchUsers(query, dto);
  }

  @ServerOperation()
  async activateUserAccount(_: IQuery<{}>, __: string, dto: ActivateUserAccountDto) {
    return this.user.activateUserAccount(dto);
  }

  @ServerOperation()
  async resendEmailVerificationEmail(_: IQuery<{}>, __: string, dto: ResendEmailVerificationEmailDto) {
    return this.user.resendEmailVerificationEmail(dto.userId);
  }

  @ServerOperation()
  async verifyEmail(_: IQuery<{}>, __: string, dto: VerifyEmailDto) {
    return this.user.verifyEmail(dto.email, dto.hash);
  }

  @ServerOperation()
  async forgotPassword(_: IQuery<{}>, __: string, dto: ForgotPasswordDto) {
    return this.user.forgotPassword(dto.email);
  }

  @ServerOperation()
  async forgotPasswordChange(_: IQuery<{}>, __: string, dto: ForgotPasswordChangeDto) {
    return this.user.forgotPasswordChange(dto.email, dto.password, dto.hash);
  }

  @ServerOperation()
  async changePassword(_: IQuery<{}>, token: string, dto: ChangePasswordDto) {
    return this.user.changePassword(token, dto);
  }

  @ServerOperation()
  async finishJoyride(_: IQuery<{}>, token: string) {
    return this.user.finishJoyride(token);
  }

  @ServerOperation()
  async adminUserSearch(query: IQuery<User[]>, token: string, dto: AdminUserSearchDto) {
    return this.user.adminUserSearch(query, token, dto);
  }
}
