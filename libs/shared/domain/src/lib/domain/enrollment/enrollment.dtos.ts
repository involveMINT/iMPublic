import { IsBoolean, IsString } from 'class-validator';

export abstract class SearchForEnrollmentsDto {
  @IsString()
  query!: string;

  @IsString()
  projectId!: string;
}

export abstract class StartEnrollmentApplicationDto {
  @IsString()
  projectId!: string;
}

export abstract class WithdrawEnrollmentApplicationDto {
  @IsString()
  enrollmentId!: string;
}

export abstract class LinkPassportDocumentDto {
  @IsString()
  enrollmentId!: string;

  @IsString()
  passportDocumentId!: string;

  @IsString()
  projectDocumentId!: string;
}

export abstract class SubmitEnrollmentApplicationDto {
  @IsString()
  enrollmentId!: string;
}

export abstract class AcceptWaiverDto {
  @IsString()
  enrollmentId!: string;
}

export abstract class ProcessEnrollmentApplicationDto {
  @IsString()
  enrollmentId!: string;

  @IsBoolean()
  approve!: boolean;
}

export abstract class RevertEnrollmentApplicationDto {
  @IsString()
  enrollmentId!: string;
}

export abstract class RetireEnrollmentDto {
  @IsString()
  enrollmentId!: string;
}

export abstract class GetEnrollmentsBySpProject {
  @IsString()
  projectId!: string;
}
