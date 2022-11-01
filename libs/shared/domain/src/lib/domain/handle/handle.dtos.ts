import { IsString } from 'class-validator';

export abstract class VerifyHandleDto {
  @IsString()
  handle!: string;
}

export abstract class SearchHandleDto {
  @IsString()
  handleSearchString!: string;
}

export abstract class ViewProfileDto {
  @IsString()
  handle!: string;
}

export abstract class GenericHandleSearchDto {
  @IsString()
  search!: string;
}
