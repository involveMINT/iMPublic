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
    Body,
    Headers,
  } from '@nestjs/common';
import { ValidationPipe } from '../pipes';

@Controller(InvolvemintRoutes.chat)
export class ChatController {
    constructor(private readonly chat: ChatService) {}

  @Post('sendMessage')
  async sendMessage(
    @Headers(TOKEN_KEY) token: string, 
    @Body(DTO_KEY, new ValidationPipe()) dto: SendChatMessageDto
  ) {
    return this.chat.sendMessage(token, dto);
  }
}
