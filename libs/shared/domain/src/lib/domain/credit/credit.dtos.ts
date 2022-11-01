import { IsNumber, IsString } from 'class-validator';

export abstract class GetCreditsForProfileDto {
  @IsString()
  profileId!: string;
}

export abstract class MintDto {
  @IsString()
  handle!: string;
  @IsNumber()
  amount!: number;
}
