import { IOperation } from '@orcha/common';
import { IsNotEmpty, IsString } from 'class-validator';

export abstract class GetStorageFileDto {
  @IsNotEmpty()
  @IsString()
  path!: string;
}

export interface IStorageOrchestration {
  getUrl: IOperation<{ url: string }, GetStorageFileDto>;
}
