import { UsersMetaData } from ".";
export type MessageStatus = "sending" | "undelivered" | "delivered" | "read" | "none";
export type Author = "system" | "time";
export interface MessageMetaData {
    id: string;
    status: MessageStatus;
}
export interface Reaction {
    username: string;
    authorId: string;
    glyphKey: string;
}
export interface ImageObject {
    src: string;
    name: string;
    fileBuffer?: ArrayBuffer;
}
export interface RepliedMessage {
    id: string;
    authorName: string;
    authorId: string;
    body: string;
    images?: ImageObject[];
    forward?: boolean;
}
export interface Message {
    id: string;
    tempId?: string;
    isSelf?: boolean;
    status?: MessageStatus;
    authorId: string;
    authorName: string;
    body: string;
    createdAt?: string;
    reactions?: Reaction[];
    images?: ImageObject[];
    imageCompression?: boolean;
    repliedMessage?: RepliedMessage | null;
}
export interface DBMessage extends Message {
    _id: string;
    usersMetaData: UsersMetaData;
}
export interface IMessageSchema extends Omit<Message, "id" | "tempId" | "isSelf" | "status"> {
    usersMetaData?: UsersMetaData;
}
