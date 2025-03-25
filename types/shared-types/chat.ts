import { UserShort, Message } from ".";

export interface ChatRoom {
  id: string;
  authorId: string;
  chatName?: string;
  avatarPath?: string;
  users: UserShort[];
  messages: Message[];
  multiple: boolean;
}

export type ChatRooms = ChatRoom[];

export interface IChatRoomSchema extends Omit<ChatRoom, "users" | "messages"> {
  users: string[];
  messages: string[];
}
