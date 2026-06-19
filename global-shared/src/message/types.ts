import type { AudioObject, DocumentObject, ImageObject, VideoObject } from '../media/types'

export type MessageStatus = 'sending' | 'undelivered' | 'delivered' | 'read' | 'none'
export type MessageLoadDirection = 'latest' | 'before' | 'after' | 'around'
export type MessageReactionUpdateAction = 'add' | 'remove'
export type MessageLinkPreviewStatus = 'pending' | 'loaded' | 'failed'

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
  documents?: DocumentObject[]
  audios?: AudioObject[]
  videos?: VideoObject[]
  forward?: boolean
}

export interface MessageLinkPreview {
  url: string
  host: string
  status: MessageLinkPreviewStatus
  title?: string
  description?: string
  image?: ImageObject
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
  documents?: DocumentObject[]
  audios?: AudioObject[]
  videos?: VideoObject[]
  imageCompression?: boolean
  linkPreview?: MessageLinkPreview | null
  repliedMessage?: RepliedMessage | null
}

export interface EventMessageDelivered {
  roomId: string
  message: Message
}

export interface EventSendMessage {
  roomId: string
  message: Message
}

export interface EventEditMessage {
  roomId: string
  messageId: string
  body: string
  images: ImageObject[]
  documents?: DocumentObject[]
  audios?: AudioObject[]
  videos?: VideoObject[]
}

export interface EventMessageEdited {
  roomId: string
  messageId: string
  body: string
  images: ImageObject[]
  documents?: DocumentObject[]
  audios?: AudioObject[]
  videos?: VideoObject[]
  linkPreview: MessageLinkPreview | null
  editedAt: number
}

export interface EventMessageLinkPreviewUpdated {
  roomId: string
  messageId: string
  linkPreview: MessageLinkPreview
}

export interface EventUpdateMessageStatus {
  roomId: string
  messageId: string
  status: MessageStatus
  userId: string
}

export interface EventMessagesStatusUpdated {
  roomId: string
  messageIds: string[]
  status: MessageStatus
  userId: string
  updatedMessagesQuantity: number
}

export interface EventChangeMessageStatus {
  roomId: string
  messageId: string
  status: MessageStatus
}

export interface EventLoadRoomMessages {
  roomId: string
  limit: number
  direction: MessageLoadDirection
  anchorMessageId?: string
}

export interface EventRoomMessagesLoaded {
  roomId: string
  messages: Message[]
  rangeStartMessageId: string | null
  rangeEndMessageId: string | null
}

export interface EventUpdatePinnedMessage {
  roomId: string
  messageId: string
  isPinned: boolean
}

export interface EventPinnedMessageUpdated {
  roomId: string
  pinnedMessageId: string | null
  pinnedMessage?: Message | null
}

export interface EventDeleteMessage {
  deleteForEveryone: boolean
  messageId: string
  roomId: string
}

export interface EventAddReaction {
  glyphKey: string
  messageId: string
  roomId: string
}

export interface EventMessageDeleted {
  messageId: string
  roomId: string
}

export interface EventUpdatedMessageReactions {
  roomId: string
  messageId: string
  action: MessageReactionUpdateAction
  reaction: MessageReaction
}
