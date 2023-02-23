import { IsString } from 'class-validator';

export abstract class CreateActivityPostDto {
  @IsString()
  poiId!: string;

  @IsString()
  userId!: string;

  // id and dateCreated will automatically be generated?

  // Likes will alwasy be 0 starting out
  // enabled will always be True stating out

}

export abstract class DisableActivityPostDto {
  @IsString()
  id!: string;
}

export abstract class EnableActivityPostDto {
  @IsString()
  id!: string;
}


export abstract class LikeActivityPostDto {
  @IsString()
  id!: string;
}

export abstract class UnlikeActivityPostDto {
  @IsString()
  id!: string;
}

