import { IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsString } from 'class-validator';
import { Request } from './request.model';

export abstract class QueryRequestsDto {
  @IsNotEmpty()
  @IsNumber()
  distance!: number;
}

export abstract class GetRequestsForProfileDto {
  @IsString()
  profileId!: string;
}

export abstract class GetOneRequestDto {
  @IsString()
  requestId!: string;
}

export abstract class CreateRequestDto {
  @IsString()
  profileId!: string;
}

export abstract class UpdateRequestDto {
  @IsString()
  requestId!: string;

  @IsNotEmptyObject()
  changes!: Partial<Omit<Request, 'id'>>;
}

export abstract class UploadRequestImageDto {
  @IsString()
  requestId!: string;
}

export abstract class DeleteRequestImageDto {
  @IsString()
  requestId!: string;

  @IsInt()
  index!: number;
}

export abstract class DeleteRequestDto {
  @IsString()
  requestId!: string;
}
