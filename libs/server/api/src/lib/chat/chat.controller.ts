import { ChatService } from '@involvemint/server/core/application-services';
import {
  InvolvemintRoutes,
  TOKEN_KEY,
  DTO_KEY,
  SendChatMessageDto,
} from '@involvemint/shared/domain';
import {
    Controller,
    Post,
    Body
  } from '@nestjs/common';
import { ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.chat)
export class ChatController {
    constructor(private readonly chat: ChatService) {}

  @Post('sendMessage')
  async sendMessage(
    @Body(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SendChatMessageDto
  ) {
    return this.chat.sendMessage(token, dto);
  }
}
