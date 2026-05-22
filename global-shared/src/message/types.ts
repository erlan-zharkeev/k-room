import type { ImageObject } from '../media/types'

import { MESSAGE_STATUS } from './constants'

export type MessageStatus = (typeof MESSAGE_STATUS)[number]

export interface MessageMetadata {
  id: string
  status: MessageStatus
}

export interface MessageReaction {
  nickname: string
  authorId: string
  glyphKey: string
}

export interface RepliedMessage {
  id: string
  authorNickname: string
  authorId: string
  body: string
  images?: ImageObject[]
  forward?: boolean
}

export interface Message {
  id: string
  tempId?: string
  isSelf?: boolean
  status?: MessageStatus
  authorId: string
  authorNickname: string
  body: string
  createdAt?: number
  reactions?: MessageReaction[]
  images?: ImageObject[]
  imageCompression?: boolean
  repliedMessage?: RepliedMessage | null
}

export interface MessageDocument extends Message {
  _id: string
  usersMetaData: MessageMetadata[]
}

export interface MessageSchema extends Omit<Message, 'id' | 'tempId' | 'isSelf' | 'status'> {
  _id?: string
  usersMetaData?: MessageMetadata[]
}
