import { IsOptional, IsString, Matches } from 'class-validator';
import { ImConfig } from '../../config';

export abstract class VerifyUserEmailDto {
  @IsString()
  email!: string;
}

export abstract class 
SignUpDto {
  /** `id` is the user's email */
  @Matches(ImConfig.regex.email)
  id!: string;

  @Matches(ImConfig.regex.password.regex)
  password!: string;

  @IsOptional()
  registerAs?: 'cm' | 'sp' | 'ep' | 'market';
}

export abstract class LoginDto {
  /** `id` is the user's email */
  @Matches(ImConfig.regex.email)
  id!: string;

  @IsString()
  password!: string;
}

export abstract class AdminLoginDto {
  @IsString()
  password!: string;
}

export abstract class ValidateAdminDto {
  @IsString()
  token!: string;
}

export abstract class SearchUserDto {
  @IsString()
  emailSearchString!: string;
}

export abstract class SnoopDto {
  @IsString()
  userId!: string;
}

export abstract class GrantBaPrivilegesDto {
  @IsString()
  id!: string;
}

export abstract class RevokeBaPrivilegesDto {
  @IsString()
  id!: string;
}

export abstract class ActivateUserAccountDto {
  @IsString()
  email!: string;

  @IsString()
  epId!: string;

  @IsString()
  activationHash!: string;

  @IsString()
  temporaryPassword!: string;

  @IsString()
  forgotPasswordHash!: string;

  @IsString()
  newPassword!: string;
}

export abstract class ResendEmailVerificationEmailDto {
  @IsString()
  userId!: string;
}

export abstract class VerifyEmailDto {
  @IsString()
  email!: string;

  @IsString()
  hash!: string;
}

export abstract class ForgotPasswordDto {
  @IsString()
  email!: string;
}

export abstract class ForgotPasswordChangeDto {
  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  hash!: string;
}

export abstract class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @Matches(ImConfig.regex.password.regex)
  newPassword!: string;
}

export abstract class AdminUserSearchDto {
  @IsString()
  searchStr!: string;
}
