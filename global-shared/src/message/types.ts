import type { ImageObject } from '../media/types'

import { MESSAGE_LOAD_DIRECTION, MESSAGE_REACTION_UPDATE_ACTION, MESSAGE_STATUS } from './constants'

export type MessageStatus = (typeof MESSAGE_STATUS)[number]
export type MessageLoadDirection = (typeof MESSAGE_LOAD_DIRECTION)[keyof typeof MESSAGE_LOAD_DIRECTION]
export type MessageReactionUpdateAction =
  (typeof MESSAGE_REACTION_UPDATE_ACTION)[keyof typeof MESSAGE_REACTION_UPDATE_ACTION]

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
  roomId?: string
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
  editedAt?: number
  reactions?: MessageReaction[]
  images?: ImageObject[]
  imageCompression?: boolean
  repliedMessage?: RepliedMessage | null
}
