import { IsString, Matches } from 'class-validator';
import { ImConfig } from '../../config';

export abstract class GetExchangeAdminsForExchangePartnerDto {
  @IsString()
  epId!: string;
}

export abstract class GetSuperAdminForExchangePartnerDto {
  @IsString()
  epId!: string;

  @IsString()
  name!: string;
}

export abstract class AddExchangeAdminDto {
  @IsString()
  epId!: string;

  @Matches(ImConfig.regex.email)
  userId!: string;
}

export abstract class RemoveExchangeAdminDto {
  @IsString()
  eaId!: string;
}
