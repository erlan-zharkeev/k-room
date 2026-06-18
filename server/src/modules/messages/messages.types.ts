import type {
  ImageObject,
  MediaObject,
  Message,
  MessageLinkPreview,
  MessageMetadata,
  RepliedMessage
} from 'global-shared'

export interface MessageSchema extends Omit<Message, 'id' | 'tempId' | 'isSelf' | 'status' | 'images'> {
  _id?: string
  images?: Array<string | ImageObject>
  deletedForUserIds?: string[]
  usersMetaData?: MessageMetadata[]
}

export interface MessageDocument extends MessageSchema {
  _id: string
  usersMetaData: MessageMetadata[]
}

export interface SendMessageParams {
  roomId: string
  userId: string
  message: Message
}

export interface ResolveRepliedMessageParams {
  repliedMessage?: RepliedMessage | null
  roomId: string
  roomMessageIds: string[]
  userId: string
}

export interface RefreshMessageLinkPreviewParams {
  appName: string
  linkPreview: MessageLinkPreview | null
  messageId: string
  roomId: string
  userIds: string[]
}

export interface LoadMessageLinkPreviewParams {
  appName: string
  preview: MessageLinkPreview
}

export interface MessageLinkPreviewFetchResponse {
  body: Buffer
  contentType: string
  location: string
  statusCode: number
}

export type MessageMediaFileObject = MediaObject & {
  contentType?: string
}

export type MessageIdProjection = Pick<MessageDocument, '_id'>

export type RepliedMessageSourceProjection = Pick<
  MessageDocument,
  '_id' | 'authorId' | 'authorNickname' | 'body' | 'images' | 'documents' | 'audios' | 'videos'
>
