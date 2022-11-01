import * as firebase from 'firebase/app';

export interface NewChatMember {
  handleId: string;
}

export interface ChatMember extends NewChatMember {
  numberUnread: number;
}

export interface Message {
  content: string;
  createdAt: firebase.default.firestore.Timestamp;
  member: ChatMember;
}

export interface ChatRoom {
  id: string;
  members: ChatMember[];
  memberHandles: string[];
  createdAt: firebase.default.firestore.Timestamp;
  messages: Message[];
  count: number;
}

export interface FormattedChatRoom {
  id: string;
  notMe: string;
  lastMessage: Date;
  members: ChatMember[];
  memberHandles: string[];
  createdAt: firebase.default.firestore.Timestamp;
  messages: Message[];
  count: number;
}

export function getUnreadMessagesCount(userHandleId: string, rooms: FormattedChatRoom[]) {
  let count = 0;
  rooms.forEach(
    (room) => (count += room.members.find((member) => member.handleId === userHandleId)?.numberUnread ?? 0)
  );
  return count;
}

export function createChatMember(handleId: string): ChatMember {
  return { handleId, numberUnread: 0 };
}
