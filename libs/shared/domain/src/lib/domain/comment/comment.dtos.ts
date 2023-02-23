import { IsString } from 'class-validator';

export abstract class CreateCommentDto {
  @IsString()
  text!: string;

  // id and dateCreated will automatically be generated?

  // Likes will alwasy be 0 starting out
  // hidden will always be True starting out

}

export abstract class HideCommentDto {
  @IsString()
  id!: string;
}
// Reveal perhpas??
export abstract class UnhideCommentDto {
  @IsString()
  id!: string;
}

