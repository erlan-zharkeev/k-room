import type { ImageObjectType } from '../media/types'

import { MESSAGE_STATUS } from './constants'

export type MessageStatusType = (typeof MESSAGE_STATUS)[number]

export interface MessageMetadataType {
  id: string
  status: MessageStatusType
}

export interface MessageReactionType {
  nickname: string
  authorId: string
  glyphKey: string
}

export interface RepliedMessageType {
  id: string
  authorNickname: string
  authorId: string
  body: string
  images?: ImageObjectType[]
  forward?: boolean
}

export interface MessageType {
  id: string
  tempId?: string
  isSelf?: boolean
  status?: MessageStatusType
  authorId: string
  authorNickname: string
  body: string
  createdAt?: number
  reactions?: MessageReactionType[]
  images?: ImageObjectType[]
  imageCompression?: boolean
  repliedMessage?: RepliedMessageType | null
}

export interface MessageDocumentType extends MessageType {
  _id: string
  usersMetaData: MessageMetadataType[]
}

export interface MessageSchemaType extends Omit<MessageType, 'id' | 'tempId' | 'isSelf' | 'status'> {
  _id?: string
  usersMetaData?: MessageMetadataType[]
}
