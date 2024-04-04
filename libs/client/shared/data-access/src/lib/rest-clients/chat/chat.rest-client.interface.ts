import { SendChatMessageDto } from '@involvemint/shared/domain';

export interface ChatRestClientInterface {
  sendMessage(dto: SendChatMessageDto): void;
}
