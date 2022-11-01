import { ChatRoom } from '@involvemint/shared/domain';
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService {
  async changeHandleInChat(oldHandle: string, newHandle: string) {
    const chatsDb = admin.firestore().collection('chats');

    const myChats = await chatsDb.where('memberHandles', 'array-contains', oldHandle).get();

    const newChats: ChatRoom[] = [];

    myChats.forEach((chat) => {
      const chatData = chat.data() as ChatRoom;
      const handleChangedChat: ChatRoom = { ...chatData };

      // Change handles
      for (const member of handleChangedChat.members) {
        if (member.handleId === oldHandle) {
          member.handleId = newHandle;
        }
      }
      for (const message of handleChangedChat.messages) {
        if (message.member.handleId === oldHandle) {
          message.member.handleId = newHandle;
        }
      }

      newChats.push(handleChangedChat);
    });

    for (const chat of newChats) {
      await chatsDb.doc(chat.id).set(chat);
    }
  }
}
