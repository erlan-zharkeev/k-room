import { IMessage } from ".";
export interface IChatRoom {
    id: string;
    authorId: string;
    chatName?: string;
    avatar?: string;
    users: string[];
    messages: IMessage[];
}
export type ChatRoomsType = IChatRoom[];
export interface IChatRoomSchema extends Omit<IChatRoom, "users" | "messages"> {
    users: string[];
    messages: string[];
}
