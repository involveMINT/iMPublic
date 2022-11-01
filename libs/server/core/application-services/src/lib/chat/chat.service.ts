import { HandleRepository } from '@involvemint/server/core/domain-services';
import {
  ChatRoom,
  createChatMember,
  environment,
  FrontendRoutes,
  FRONTEND_ROUTES_TOKEN,
  IM_ACTIVE_PROFILE_QUERY_PARAM,
  Message,
  SendChatMessageDto,
} from '@involvemint/shared/domain';
import { Inject, Injectable } from '@nestjs/common';
import { compareDesc, differenceInMinutes } from 'date-fns';
import * as admin from 'firebase-admin';
import { AuthService } from '../auth/auth.service';
import { SMSService } from '../sms/sms.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(FRONTEND_ROUTES_TOKEN) private readonly routes: FrontendRoutes,
    private readonly auth: AuthService,
    private readonly handleRepo: HandleRepository,
    private readonly sms: SMSService
  ) {}

  async sendMessage(token: string, dto: SendChatMessageDto) {
    await this.auth.authenticateFromUserHandle(dto.senderHandleId, token);

    const ref = admin.firestore().collection('chats').doc(dto.chatRoomId);

    const chatRoom = (await ref.get()).data() as ChatRoom;

    // Tell Chat members that somebody sent a message.
    for (const member of chatRoom.members) {
      if (member.handleId !== dto.senderHandleId) {
        member.numberUnread += 1;
      }
    }

    const newMessage: Message = {
      member: createChatMember(dto.senderHandleId),
      content: dto.content,
      createdAt: admin.firestore.Timestamp.now(),
    };

    chatRoom.messages = [...chatRoom.messages, newMessage];

    // Delete messages if over size limit.
    {
      const maxLen = 100;
      const msgLen = chatRoom.messages.length;
      const charLen = JSON.stringify(chatRoom).length;

      if (charLen >= 10000 || msgLen >= maxLen) {
        // Always delete at least 1 message
        const deleteCount = msgLen - maxLen <= 0 ? 1 : msgLen - maxLen;
        chatRoom.messages.splice(0, deleteCount);
      }
    }

    // Send message.
    const batch = admin.firestore().batch();
    batch.set(ref, chatRoom, { merge: true });
    await batch.commit();

    // Send text notification.
    let phone: string | undefined;
    let link: string | undefined;

    const senderProfile = await this.handleRepo.findOneOrFail(dto.senderHandleId);

    // Don't send message to self.
    for (const member of chatRoom.members.filter((m) => senderProfile.id !== m.handleId)) {
      const myMessages = chatRoom.messages
        .filter((m) => m.member.handleId !== member.handleId)
        .sort((a, b) => compareDesc(a.createdAt.toDate(), b.createdAt.toDate()));
      const lastMessageReceived: Message | undefined = myMessages?.[1];
      if (
        lastMessageReceived?.createdAt &&
        differenceInMinutes(new Date(), lastMessageReceived.createdAt.toDate()) < 90
      ) {
        continue;
      }

      const receiverProfile = await this.handleRepo.findOneOrFail(member.handleId, {
        changeMaker: { id: true, phone: true },
        exchangePartner: { id: true, phone: true },
        servePartner: { id: true, phone: true },
      });

      if (receiverProfile.changeMaker) {
        phone = receiverProfile.changeMaker.phone;
        link = `${environment.appUrl}${this.routes.path.chat.ROOT}/${dto.chatRoomId}?${IM_ACTIVE_PROFILE_QUERY_PARAM}=${receiverProfile.changeMaker.id}`;
      } else if (receiverProfile.servePartner) {
        phone = receiverProfile.servePartner.phone;
        link = `${environment.appUrl}${this.routes.path.chat.ROOT}/${dto.chatRoomId}?${IM_ACTIVE_PROFILE_QUERY_PARAM}=${receiverProfile.servePartner.id}`;
      } else if (receiverProfile.exchangePartner) {
        phone = receiverProfile.exchangePartner.phone;
        link = `${environment.appUrl}${this.routes.path.chat.ROOT}/${dto.chatRoomId}?${IM_ACTIVE_PROFILE_QUERY_PARAM}=${receiverProfile.exchangePartner.id}`;
      }

      // Send notification for someone who re-started chatting with you.
      if (phone) {
        await this.sms.sendInfoSMS({
          message: `@${member.handleId} has received a new chat message from @${myMessages[0].member.handleId}. Click here to view: ${link}`,
          phone,
        });
      }
    }
  }
}
