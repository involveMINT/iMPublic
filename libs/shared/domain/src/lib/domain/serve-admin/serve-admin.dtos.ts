import { IsString, Matches } from 'class-validator';
import { ImConfig } from '../../config';

export abstract class GetServeAdminsForServePartnerDto {
  @IsString()
  spId!: string;
}

export abstract class AddServeAdminDto {
  @IsString()
  spId!: string;

  @Matches(ImConfig.regex.email)
  userId!: string;
}

export abstract class RemoveServeAdminDto {
  @IsString()
  saId!: string;
}
