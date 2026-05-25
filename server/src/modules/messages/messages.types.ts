import type { ImageObject, Message, MessageMetadata, MessageReaction, RepliedMessage } from 'global-shared'

export interface MessageSchema {
  _id?: string
  authorId: string
  authorNickname: string
  body: string
  createdAt?: number
  reactions?: MessageReaction[]
  images?: Array<string | ImageObject>
  imageCompression?: boolean
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
  message: Message
}
