import { IOperation } from '@orcha/common';
import { SendChatMessageDto } from './chat.dtos';

export interface IChatOrchestration {
  sendMessage: IOperation<void, SendChatMessageDto>;
}
