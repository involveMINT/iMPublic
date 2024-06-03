import { HttpClient } from '@angular/common/http';
import { ActivateUserAccountDto, AdminLoginDto, AdminUserSearchDto, AdminUserSearchQuery, ChangePasswordDto, DTO_KEY, ForgotPasswordChangeDto, ForgotPasswordDto, GrantBaPrivilegesDto, IParser, IQuery, ISnoopData, InvolvemintRoutes, LoginDto, QUERY_KEY, ResendEmailVerificationEmailDto, RevokeBaPrivilegesDto, SearchUserDto, SignUpDto, SnoopDto, User, UserPrivilegeQuery, UserQuery, UserSearchQuery, ValidateAdminDto, VerifyEmailDto, VerifyUserEmailDto, VerifyUserEmailQuery, environment } from '@involvemint/shared/domain';
import { Injectable } from '@angular/core';

@Injectable()
export class UserRestClient {
  apiUrl = `${environment.apiUrl}/${InvolvemintRoutes.user}`;

  constructor(private http: HttpClient) { }
  
  verifyUserEmail(query: IQuery<typeof VerifyUserEmailQuery>, dto: VerifyUserEmailDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<typeof VerifyUserEmailQuery, typeof VerifyUserEmailQuery>>(`${this.apiUrl}/verifyUserEmail`, body);
  }

  signUp(query: IQuery<{ token: string }>, dto: SignUpDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ token: string }, { token: string }>>(`${this.apiUrl}/signUp`, body);
  }

  login(query: IQuery<{ token: string }>, dto: LoginDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ token: string }, { token: string }>>(`${this.apiUrl}/login`, body);
  }

  adminLogin(query: IQuery<{ token: string }>, dto: AdminLoginDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ token: string }, { token: string }>>(`${this.apiUrl}/adminLogin`, body);
  }

  validateAdminToken(query: IQuery<{ token: string }>, dto: ValidateAdminDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<{ token: string }, { token: string }>>(`${this.apiUrl}/validateAdminToken`, body);
  }

  getUserData(query: IQuery<User>)
  {
    const body = {
      [QUERY_KEY]: query,
    };

    return this.http
          .post<IParser<User, typeof UserQuery>>(`${this.apiUrl}/getUserData`, body);
  }

  snoop(query: IQuery<ISnoopData>, dto: SnoopDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<ISnoopData, { token: string} & typeof UserQuery>>(`${this.apiUrl}/snoop`, body);
  }

  getAllUserPrivileges(query: IQuery<User[]>)
  {
    const body = {
      [QUERY_KEY]: query,
    };

    return this.http
          .post<IParser<User, typeof UserPrivilegeQuery>[]>(`${this.apiUrl}/getAllUserPrivileges`, body);
  }

  grantBAPrivilege(query: IQuery<User>, dto: GrantBaPrivilegesDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<User, typeof UserPrivilegeQuery>>(`${this.apiUrl}/grantBAPrivilege`, body);
  }

  revokeBAPrivilege(query: IQuery<User>, dto: RevokeBaPrivilegesDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<User, typeof UserPrivilegeQuery>>(`${this.apiUrl}/revokeBAPrivilege`, body);
  }

  searchUsers(query: IQuery<User[]>, dto: SearchUserDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<User, typeof UserSearchQuery>[]>(`${this.apiUrl}/searchUsers`, body);
  }

  activateUserAccount(query: IQuery<Record<string, never>>, dto: ActivateUserAccountDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/activateUserAccount`, body);
  }

  resendEmailVerificationEmail(query: IQuery<Record<string, never>>, dto: ResendEmailVerificationEmailDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/resendEmailVerificationEmail`, body);
  }

  verifyEmail(query: IQuery<Record<string, never>>, dto: VerifyEmailDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/verifyEmail`, body);
  }

  forgotPassword(query: IQuery<Record<string, never>>, dto: ForgotPasswordDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/forgotPassword`, body);
  }

  forgotPasswordChange(query: IQuery<Record<string, never>>, dto: ForgotPasswordChangeDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/forgotPasswordChange`, body);
  }

  changePassword(query: IQuery<Record<string, never>>, dto: ChangePasswordDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http
          .post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/changePassword`, body);
  }

  finishJoyride(query: IQuery<Record<string, never>>)
  {
    return this.http.post<IParser<Record<string, never>, Record<string, never>>>(`${this.apiUrl}/finishJoyride`, {
      [QUERY_KEY]: query
    });
  }
  
  adminUserSearch(query: IQuery<User[]>, dto: AdminUserSearchDto)
  {
    const body = {
      [QUERY_KEY]: query,
      [DTO_KEY]: dto
    };

    return this.http.post<IParser<User, typeof AdminUserSearchQuery>[]>(`${this.apiUrl}/adminUserSearch`, body);
  }
}
