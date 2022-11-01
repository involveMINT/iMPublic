import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import 'reflect-metadata';
import { ImConfig } from '../../config/im-config';
import { CmOnboardingState } from './change-maker.model';

export abstract class CreateChangeMakerProfileDto {
  @IsNotEmpty()
  @Matches(ImConfig.regex.firstName)
  firstName!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.lastName)
  lastName!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.handle)
  handle!: string;

  @IsNotEmpty()
  @Matches(ImConfig.regex.phone)
  phone!: string;

  @IsOptional()
  @IsString()
  onboardingState?: CmOnboardingState;
}

abstract class HandleChange {
  @Matches(ImConfig.regex.handle)
  id!: string;
}

export abstract class EditCmProfileDto {
  @IsOptional()
  @Matches(ImConfig.regex.firstName)
  firstName?: string;

  @IsOptional()
  @Matches(ImConfig.regex.lastName)
  lastName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HandleChange)
  handle?: HandleChange;

  @IsOptional()
  @Matches(ImConfig.regex.bio)
  bio?: string;

  @IsOptional()
  @Matches(ImConfig.regex.phone)
  phone?: string;

  @IsOptional()
  @IsString()
  profilePicFilePath?: string;

  @IsOptional()
  @IsString()
  onboardingState?: CmOnboardingState;
}
