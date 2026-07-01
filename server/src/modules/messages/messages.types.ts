import type {
  ImageObject,
  MediaObject,
  Message,
  MessageLinkPreview,
  MessageMetadata,
  RepliedMessage
} from 'global-shared'

import type { NotificationsService } from '../notifications/notifications.service'
import type { PresenceService } from '../presence/presence.service'

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
  presenceService?: PresenceService
  notificationsService?: Pick<NotificationsService, 'sendMessagePushNotifications'>
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
  '_id' | 'authorId' | 'authorKind' | 'authorNickname' | 'body' | 'images' | 'documents' | 'audios' | 'videos'
>
