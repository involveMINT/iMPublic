import { IsOptional, IsString } from 'class-validator';

export abstract class EditPassportDocumentDto {
  @IsString()
  documentId!: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export abstract class ReplacePassportDocumentDto {
  @IsString()
  documentId!: string;
}

export abstract class DeletePassportDocumentDto {
  @IsString()
  documentId!: string;
}
