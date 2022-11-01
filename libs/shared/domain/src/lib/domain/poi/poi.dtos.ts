import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import 'reflect-metadata';

export abstract class GetPoisByProjectDto {
  @IsString()
  projectId!: string;
}

export abstract class CreatePoiDto {
  @IsString()
  enrollmentId!: string;
}

export abstract class StartPoiTimerDto {
  @IsString()
  poiId!: string;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  latitude?: number;
}

export abstract class StopPoiTimerDto {
  @IsString()
  poiId!: string;
}

export abstract class WithdrawPoiDto {
  @IsString()
  poiId!: string;
}

export abstract class PausePoiTimerDto {
  @IsString()
  poiId!: string;
}

export abstract class ResumePoiTimerDto {
  @IsString()
  poiId!: string;
}

export abstract class EndPoiTimerDto {
  @IsString()
  poiId!: string;
}

export abstract class QuestionAnswersDto {
  @IsString()
  questionId!: string;

  @IsNotEmpty()
  @IsString()
  answer!: string;
}

export abstract class SubmitPoiDto {
  @IsString()
  poiId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswersDto)
  answers!: QuestionAnswersDto[];
}

export abstract class ApprovePoiDto {
  @IsString()
  poiId!: string;
}

export abstract class DenyPoiDto {
  @IsString()
  poiId!: string;
}
