import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ImConfig } from '../../config';

// TODO @Matches with @IsOptional doesn't work :(

export abstract class SubmitEpApplicationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.handle)
  handle!: string;

  @IsOptional({})
  // @Matches(ImConfig.regex.url, { always: false, })
  website!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.phone)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  address1!: string;

  @IsString()
  address2?: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.zipCode)
  zip!: string;

  @IsOptional()
  // @Matches(ImConfig.regex.email, { always: false })
  email!: string;

  @IsOptional()
  // @Matches(ImConfig.regex.ein, { always: false })
  ein!: string;
}

export abstract class ProcessEpApplicationDto {
  @IsString()
  id!: string;

  @IsBoolean()
  @IsNotEmpty()
  allow!: boolean;
}

export abstract class WithdrawEpApplicationDto {
  @IsString()
  epAppId!: string;
}

export abstract class BaSubmitEpApplicationDto {
  @IsNotEmpty()
  @IsString()
  @Matches(ImConfig.regex.email, { always: false })
  email!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.handle)
  handle!: string;

  @IsOptional({})
  // @Matches(ImConfig.regex.url, { always: false, })
  website!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.phone)
  phone!: string;

  @IsNotEmpty()
  @IsString()
  address1!: string;

  @IsString()
  address2?: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.zipCode)
  zip!: string;

  @IsOptional()
  // @Matches(ImConfig.regex.ein, { always: false })
  ein!: string;
}
