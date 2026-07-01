import type { WebPushSubscriptionEnabledGroups, WebPushSubscriptionKeysPayload } from 'global-shared'

import type { ChatRoomDocument, ChatRoomSchema } from '../chat-rooms/chat-rooms.types'
import type { UserPersonalData, UserSchema, UserSystemData } from '../user/user.types'

export interface WebPushSubscriptionSchema {
  userId: string
  endpoint: string
  expirationTime?: number | null
  keys: WebPushSubscriptionKeysPayload
  enabledGroups: WebPushSubscriptionEnabledGroups
  userAgent?: string
  createdAt: number
  updatedAt: number
}

export interface WebPushSubscriptionDocument extends WebPushSubscriptionSchema {
  _id: string
}

export interface SendMessagePushNotificationsParams {
  roomId: string
  authorId: string
  authorKind?: string
  authorNickname: string
  body?: string
  messageId: string
  recipientIds: string[]
}

export interface SendRoomCallPushNotificationsParams {
  roomId: string
  roomCallId: string
  initiatorId: string
  recipientIds: string[]
}

export type WebPushBadgeRoomProjection = Pick<ChatRoomDocument, '_id'> & Pick<ChatRoomSchema, 'messages'>

export type WebPushTargetUserProjection = Pick<UserSchema, '_id'> & {
  personal: Pick<UserPersonalData, 'chatRooms' | 'mutedChatRoomIds'>
  system: Pick<UserSystemData, 'role'>
}
