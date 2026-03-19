import { IImageObject } from ".";

export const MESSAGE_STATUS = ["sending", "undelivered", "delivered", "read", "none"] as const;
export type MessageStatusType = (typeof MESSAGE_STATUS)[number];


export type AuthorType = "system" | "time";

export interface IMessageMetaData {
  id: string;
  status: MessageStatusType;
}

export interface IReaction {
  username: string;
  authorId: string;
  glyphKey: string;
}

export interface IRepliedMessage {
  id: string;
  authorName: string;
  authorId: string;
  body: string;
  images?: IImageObject[];
  forward?: boolean;
}

export interface IMessage {
  id: string;
  tempId?: string;
  isSelf?: boolean;
  status?: MessageStatusType;
  authorId: string;
  authorName: string;
  body: string;
  createdAt?: string;
  reactions?: IReaction[];
  images?: IImageObject[];
  imageCompression?: boolean;
  repliedMessage?: IRepliedMessage | null;
}

export interface IDBMessage extends IMessage {
  _id: string;
  usersMetaData: Array<unknown>;
}

export interface IMessageSchema
  extends Omit<IMessage, "id" | "tempId" | "isSelf" | "status"> {
  _id?: string;
  usersMetaData?: Array<unknown>;
}
