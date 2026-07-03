import { Injectable } from '@nestjs/common'
import {
  type DeleteWebPushSubscriptionPayload,
  type WebPushConfigResponse,
  type WebPushNotificationPayload,
  type WebPushSubscriptionPayload,
  getAppCallPath,
  getAppChatRoomPath,
  isNumber,
  isUnknownObject
} from 'global-shared'
import webPush, { type PushSubscription } from 'web-push'

import { SERVER_ENV } from 'src/app/env'
import { countUnreadMessagesByIds } from 'src/modules/messages/lib/message-persistence'
import { PresenceService } from 'src/modules/presence/presence.service'
import { countUnseenMissedRoomCalls } from 'src/modules/room-calls/lib/missed-room-calls'
import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { ChatRoomModel } from '../chat-rooms/chat-rooms.model'
import { UserModel } from '../user/user.model'

import { WEB_PUSH_EXPIRED_STATUS_CODES } from './notifications.constants'
import { WebPushSubscriptionModel } from './notifications.model'
import type {
  SendMessagePushNotificationsParams,
  SendRoomCallPushNotificationsParams,
  WebPushBadgeRoomProjection,
  WebPushTargetUserProjection,
  WebPushSubscriptionDocument
} from './notifications.types'

@Injectable()
export class NotificationsService {
  constructor(private readonly presenceService: PresenceService) {
    const { enabled, privateKey, publicKey, subject } = SERVER_ENV.notifications.webPush

    if (!enabled) return

    webPush.setVapidDetails(subject, publicKey, privateKey)
  }

  getWebPushConfig(): WebPushConfigResponse {
    const { enabled, publicKey } = SERVER_ENV.notifications.webPush

    return {
      enabled,
      publicKey: enabled ? publicKey : ''
    }
  }

  async upsertWebPushSubscription(userId: string, payload: WebPushSubscriptionPayload) {
    if (!SERVER_ENV.notifications.webPush.enabled) return

    const now = Date.now()

    await WebPushSubscriptionModel.updateOne(
      { endpoint: payload.endpoint },
      {
        $set: {
          userId,
          endpoint: payload.endpoint,
          expirationTime: payload.expirationTime,
          keys: payload.keys,
          enabledGroups: payload.enabledGroups,
          userAgent: payload.userAgent ?? '',
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      { upsert: true }
    )
  }

  async deleteWebPushSubscription(userId: string, payload: DeleteWebPushSubscriptionPayload) {
    await WebPushSubscriptionModel.deleteOne({ userId, endpoint: payload.endpoint })
  }

  async sendMessagePushNotifications({
    authorId,
    authorKind,
    authorNickname,
    body,
    messageId,
    recipientIds,
    roomId
  }: SendMessagePushNotificationsParams) {
    if (!SERVER_ENV.notifications.webPush.enabled) return

    const targetUserIds = recipientIds.filter((userId) => userId !== authorId)

    if (!targetUserIds.length) return

    const title = authorKind === 'support' || !authorNickname ? SERVER_ENV.info.appName : authorNickname
    const trimmedBody = body?.trim()
    const payload: WebPushNotificationPayload = {
      title,
      options: {
        body: trimmedBody || 'New message',
        tag: messageId,
        data: {
          url: getAppChatRoomPath(roomId)
        }
      }
    }

    await this.sendWebPushToUsers(targetUserIds, roomId, 'messages', payload)
  }

  async sendRoomCallPushNotifications({
    initiatorId,
    recipientIds,
    roomCallId,
    roomId
  }: SendRoomCallPushNotificationsParams) {
    if (!SERVER_ENV.notifications.webPush.enabled) return

    const targetUserIds = recipientIds.filter((userId) => userId !== initiatorId)

    if (!targetUserIds.length) return

    const [initiator, room] = await Promise.all([
      UserModel.findById(initiatorId, { 'public.nickname': 1 }).lean(),
      ChatRoomModel.findById(roomId, { chatName: 1, chatKind: 1 }).lean()
    ])
    const initiatorNickname = initiator?.public.nickname ?? SERVER_ENV.info.appName
    const isGroupRoom = room?.chatKind === 'group'
    const title = isGroupRoom && room?.chatName ? room.chatName : initiatorNickname
    const body = isGroupRoom ? `${initiatorNickname} started a call` : 'Incoming call'
    const payload: WebPushNotificationPayload = {
      title,
      options: {
        body,
        tag: roomCallId,
        data: {
          url: getAppCallPath(roomId)
        }
      }
    }

    await this.sendWebPushToUsers(targetUserIds, roomId, 'calls', payload)
  }

  private async sendWebPushToUsers(
    userIds: string[],
    roomId: string,
    group: 'calls' | 'messages',
    payload: WebPushNotificationPayload
  ) {
    const [subscriptions, users] = await Promise.all([
      WebPushSubscriptionModel.find({
        userId: { $in: userIds },
        [`enabledGroups.${group}`]: true
      }).lean<WebPushSubscriptionDocument[]>(),
      UserModel.find(
        { _id: { $in: userIds } },
        {
          'personal.chatRooms': 1,
          'personal.lastSeenMissedRoomCallCalledAt': 1,
          'personal.mutedChatRoomIds': 1,
          'system.role': 1
        }
      ).lean<WebPushTargetUserProjection[]>()
    ])
    const userById = new Map(users.map((user) => [stringifyMongoId(user._id), user]))
    const activeSubscriptions = subscriptions.filter((subscription) => {
      const mutedRoomIds = userById.get(subscription.userId)?.personal.mutedChatRoomIds ?? []

      return !mutedRoomIds.includes(roomId)
    })
    const activeUserIds = Array.from(new Set(activeSubscriptions.map(({ userId }) => userId)))
    const notificationForegroundByUserId = await this.presenceService.notificationForegroundMapByUserIds(activeUserIds)
    const targetSubscriptions = activeSubscriptions.filter(
      (subscription) => !notificationForegroundByUserId.get(subscription.userId)
    )
    const targetUserIds = Array.from(new Set(targetSubscriptions.map(({ userId }) => userId)))
    const badgeCountByUserId = await this.loadWebPushBadgeCountByUserId(targetUserIds, userById)

    await Promise.all(
      targetSubscriptions.map((subscription) =>
        this.sendWebPush(subscription, {
          ...payload,
          badgeCount: (badgeCountByUserId.get(subscription.userId) ?? 0) + (group === 'calls' ? 1 : 0),
          options: {
            ...payload.options,
            data: {
              ...payload.options.data,
              group
            }
          }
        })
      )
    )
  }

  private async loadWebPushBadgeCountByUserId(userIds: string[], userById: Map<string, WebPushTargetUserProjection>) {
    const users = userIds.flatMap((userId) => {
      const user = userById.get(userId)

      return user ? [user] : []
    })

    if (!users.length) return new Map<string, number>()

    const personalRoomIds = Array.from(new Set(users.flatMap((user) => user.personal.chatRooms)))
    const hasAdminUser = users.some((user) => user.system.role === 'admin')
    const [personalRooms, supportRooms] = await Promise.all([
      ChatRoomModel.find({ _id: { $in: personalRoomIds } }, { messages: 1 }).lean<WebPushBadgeRoomProjection[]>(),
      hasAdminUser
        ? ChatRoomModel.find({ chatKind: 'support' }, { messages: 1 }).lean<WebPushBadgeRoomProjection[]>()
        : []
    ])
    const personalRoomById = new Map(personalRooms.map((room) => [stringifyMongoId(room._id), room]))
    const supportRoomById = new Map(supportRooms.map((room) => [stringifyMongoId(room._id), room]))
    const entries = await Promise.all(
      users.map(async (user) => {
        const userId = stringifyMongoId(user._id)
        const roomById = new Map(
          user.personal.chatRooms.flatMap((roomId) => {
            const room = personalRoomById.get(roomId)

            return room ? [[roomId, room]] : []
          })
        )

        if (user.system.role === 'admin') {
          supportRoomById.forEach((room, roomId) => {
            roomById.set(roomId, room)
          })
        }

        const roomIds = Array.from(roomById.keys())
        const messageIds = Array.from(roomById.values()).flatMap((room) => room.messages)
        const [unreadMessagesCount, unseenMissedRoomCallsCount] = await Promise.all([
          countUnreadMessagesByIds(userId, messageIds),
          countUnseenMissedRoomCalls(userId, roomIds, user.personal.lastSeenMissedRoomCallCalledAt ?? 0)
        ])
        const badgeCount = unreadMessagesCount + unseenMissedRoomCallsCount

        return [userId, badgeCount] as const
      })
    )

    return new Map(entries)
  }

  private async sendWebPush(subscription: WebPushSubscriptionDocument, payload: WebPushNotificationPayload) {
    try {
      await webPush.sendNotification(this.toWebPushSubscription(subscription), JSON.stringify(payload))
    } catch (error) {
      if (!this.isExpiredWebPushSubscriptionError(error)) return

      await WebPushSubscriptionModel.deleteOne({ endpoint: subscription.endpoint })
    }
  }

  private toWebPushSubscription(subscription: WebPushSubscriptionDocument): PushSubscription {
    return {
      endpoint: subscription.endpoint,
      keys: subscription.keys
    }
  }

  private isExpiredWebPushSubscriptionError(error: unknown) {
    const statusCode = isUnknownObject(error) && isNumber(error.statusCode) ? error.statusCode : 0

    return WEB_PUSH_EXPIRED_STATUS_CODES.includes(statusCode)
  }
}
