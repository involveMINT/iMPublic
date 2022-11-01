import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ImConfig } from '../../config';

export abstract class SubmitSpApplicationDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.handle)
  handle!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.url)
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

  @IsNotEmpty()
  @Matches(ImConfig.regex.email)
  email!: string;
}

export abstract class ProcessSpApplicationDto {
  @IsString()
  id!: string;

  @IsBoolean()
  @IsNotEmpty()
  allow!: boolean;
}

export abstract class WithdrawSpApplicationDto {
  @IsString()
  spAppId!: string;
}
