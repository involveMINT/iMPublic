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
  InvolvemintRoutes,
  ISnoopData,
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
  QUERY_KEY,
  TOKEN_KEY,
  DTO_KEY,
  Query,
  parseQuery
} from '@involvemint/shared/domain';
import { 
  Controller,
  Post,
  Body,
  Headers
} from '@nestjs/common';
import { QueryValidationPipe, ValidationPipe } from '../pipes';
import { Console } from 'console';



@Controller(InvolvemintRoutes.user)
export class UserController {
  constructor(private readonly auth: AuthService, private readonly user: UserService) {}

  @Post('verifyUserEmail')
  async verifyUserEmail(
    @Body(QUERY_KEY, new QueryValidationPipe(VerifyUserEmailQuery)) query: Query<{ isUnique: boolean }>, 
    @Body(DTO_KEY, new ValidationPipe()) { email }: VerifyUserEmailDto
  ) {
    return parseQuery(query, { isUnique: await this.user.verifyUserEmail(email) });
  }

  @Post('signUp')
  async signUp(
    @Body(QUERY_KEY, new QueryValidationPipe(SignUpQuery)) query: {token:true}, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SignUpDto
  ) {
    return this.user.signUp(dto, query);
  }

  @Post('login')
  async login(
    @Body(QUERY_KEY, new QueryValidationPipe(LoginQuery)) query: { token: true }, 
    @Body(DTO_KEY, new ValidationPipe()) { id, password }: LoginDto
  ) {
    return this.user.login(id, password, query);
  }

  @Post('adminLogin')
  async adminLogin(
    @Body(QUERY_KEY, new QueryValidationPipe(AdminLoginQuery)) query: Query<{ token: string }>, 
    @Body(DTO_KEY, new ValidationPipe()) { password }: AdminLoginDto
  ) {
    return this.user.adminLogin(password, query);
  }

  @Post('validateAdminToken')
  async validateAdminToken(
    @Body(QUERY_KEY, new QueryValidationPipe(ValidateAdminTokenQuery)) query: Query<{ token: string }>, 
    @Body(DTO_KEY, new ValidationPipe()) { token }: ValidateAdminDto
  ) {
    return this.user.validateAdminToken(query, token);
  }

  @Post('getUserData')
  async getUserData(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery)) query: Query<User>, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.user.getUserData(query, token);
  }

  @Post('snoop')
  async snoop(
    @Body(QUERY_KEY, new QueryValidationPipe(SnoopQuery)) query: Query<ISnoopData>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SnoopDto
  ) {
    return this.user.snoop(query, token, dto);
  }

  @Post('getAllUserPrivileges')
  async getAllUserPrivileges(
    @Body(QUERY_KEY, new QueryValidationPipe(UserPrivilegeQuery)) query: Query<User[]>, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.user.getAllUserPrivileges(query, token);
  }

  @Post('grantBAPrivilege')
  async grantBAPrivilege(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery)) query: Query<User>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: GrantBaPrivilegesDto
  ) {
    return this.user.grantBAPrivilege(query, token, dto);
  }

  @Post('revokeBAPrivilege')
  async revokeBAPrivilege(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery)) query: Query<User>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: RevokeBaPrivilegesDto
  ) {
    return this.user.revokeBAPrivilege(query, token, dto);
  }

  @Post('searchUsers')
  async searchUsers(
    @Body(QUERY_KEY, new QueryValidationPipe(UserSearchQuery)) query: Query<User[]>, 
    @Headers(TOKEN_KEY) _: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SearchUserDto
  ) {
    return this.user.searchUsers(query, dto);
  }

  @Post('activateUserAccount')
  async activateUserAccount( 
    @Body(DTO_KEY, new ValidationPipe()) dto: ActivateUserAccountDto
  ) {
    return this.user.activateUserAccount(dto);
  }

  @Post('resendEmailVerificationEmail')
  async resendEmailVerificationEmail(
    @Body(DTO_KEY, new ValidationPipe()) dto: ResendEmailVerificationEmailDto
  ) {
    return this.user.resendEmailVerificationEmail(dto.userId);
  }

  @Post('verifyEmail')
  async verifyEmail(
    @Body(DTO_KEY, new ValidationPipe()) dto: VerifyEmailDto
  ) {
    return this.user.verifyEmail(dto.email, dto.hash);
  }

  @Post('forgotPassword')
  async forgotPassword(
    @Body(DTO_KEY, new ValidationPipe()) dto: ForgotPasswordDto
  ) {
    return this.user.forgotPassword(dto.email);
  }

  @Post('forgotPasswordChange')
  async forgotPasswordChange(
    @Body(DTO_KEY, new ValidationPipe()) dto: ForgotPasswordChangeDto
  ) {
    return this.user.forgotPasswordChange(dto.email, dto.password, dto.hash);
  }

  @Post('changePassword')
  async changePassword(
    @Body(QUERY_KEY, new QueryValidationPipe({})) _: Query<{}>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: ChangePasswordDto
  ) {
    return this.user.changePassword(token, dto);
  }

  @Post('finishJoyride')
  async finishJoyride(
    @Body(QUERY_KEY, new QueryValidationPipe({})) _: Query<{}>, 
    @Headers(TOKEN_KEY) token: string
  ) {
    return this.user.finishJoyride(token);
  }

  @Post('adminUserSearch')
  async adminUserSearch(
    @Body(QUERY_KEY, new QueryValidationPipe(UserQuery)) query: Query<User[]>, 
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: AdminUserSearchDto
  ) {
    return this.user.adminUserSearch(query, token, dto);
  }
}
