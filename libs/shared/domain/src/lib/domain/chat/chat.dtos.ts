import { IsNotEmpty, IsString } from 'class-validator';

export abstract class SendChatMessageDto {
  @IsString()
  @IsNotEmpty()
  chatRoomId!: string;

  @IsString()
  @IsNotEmpty()
  senderHandleId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
