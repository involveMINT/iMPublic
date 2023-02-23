import { IsString } from 'class-validator';

export abstract class CreateLikeDto {
  // id and dateCreated will automatically be generated?
}

export abstract class RemoveLikeDto {
  @IsString()
  id!: string;
}

