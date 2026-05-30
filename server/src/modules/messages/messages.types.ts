import type {
  DocumentObject,
  ImageObject,
  Message,
  MessageLinkPreview,
  MessageMetadata,
  MessageReaction,
  RepliedMessage
} from 'global-shared'

export interface MessageSchema {
  _id?: string
  authorId: string
  authorNickname: string
  body: string
  createdAt?: number
  editedAt?: number
  reactions?: MessageReaction[]
  images?: Array<string | ImageObject>
  documents?: DocumentObject[]
  imageCompression?: boolean
  linkPreview?: MessageLinkPreview | null
  deletedForUserIds?: string[]
  usersMetaData?: MessageMetadata[]
  repliedMessage?: RepliedMessage | null
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
  linkPreview: MessageLinkPreview | null
  messageId: string
  roomId: string
  userIds: string[]
}
