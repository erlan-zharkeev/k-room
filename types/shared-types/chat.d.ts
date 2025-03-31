import { UserShortType, IMessage } from ".";
export interface IChatRoom {
    id: string;
    authorId: string;
    chatName?: string;
    avatarPath?: string;
    users: UserShortType[];
    messages: IMessage[];
    multiple: boolean;
}
export type ChatRoomsType = IChatRoom[];
export interface IChatRoomSchema extends Omit<IChatRoom, "users" | "messages"> {
    users: string[];
    messages: string[];
}
