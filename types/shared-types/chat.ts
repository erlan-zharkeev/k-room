import { UserShort, Message } from ".";

export interface ChatRoom {
  id: string;
  authorId: string;
  chatName: string;
  avatarPath?: string;
  users: Array<UserShort>;
  messages: Array<Message>;
  multiple: boolean;
  hasOnline: boolean;
}

export interface DBChatRoom extends Omit<ChatRoom, "users" | "messages"> {
  _id: string;
  users: Array<string>;
  messages: Array<string>;
}

export type ChatRooms = Array<ChatRoom>;

export interface IDBChatRoomSchema extends DBChatRoom { }
