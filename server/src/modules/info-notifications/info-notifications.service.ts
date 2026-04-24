import {
  type AppLanguageType,
  type IEventInfoNotificationStatusUpdated,
  type InfoNotificationMapType,
  type InfoNotificationStatusType,
  type IInfoNotification,
  type IUserInfoNotification,
  REQ_STATUS,
  type SocketActionsType,
  WELCOME_INFO_NOTIFICATION_ID
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'
import { getIO } from 'src/shared/lib/io'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'
import { normalizeObjectId } from 'src/shared/lib/normalize-object-id'
import type { MongoIdType } from 'src/shared/types/mongo'

import { UserModel } from '../user/user.model'
import { getSocketsByUserIds } from '../user/user.service'

import { InfoNotificationStateModel } from './info-notification-state.model'
import { INFO_NOTIFICATION_FIXTURES } from './info-notifications.constants'
import { INFO_NOTIFICATION_SHARED_I18N, INFO_NOTIFICATION_STATE_I18N } from './info-notifications.i18n'
import { InfoNotificationModel } from './info-notifications.model'

export const createInfoNotificationState = async ({
  userId,
  infoNotifications
}: {
  userId: MongoIdType
  infoNotifications: InfoNotificationMapType
}) => {
  return new InfoNotificationStateModel({
    userId: normalizeObjectId(userId),
    infoNotifications
  }).save()
}

export const getActiveInfoNotifications = async ({
  ids,
  createdAfter
}: {
  ids?: string[]
  createdAfter?: number
} = {}): Promise<IInfoNotification[]> => {
  if (ids && !ids.length) {
    return []
  }

  const query: Record<string, unknown> = {
    isActive: true
  }

  if (ids?.length) {
    query._id = { $in: ids }
  }

  if (createdAfter) {
    query.createdAt = { $gte: createdAfter }
  }

  const notifications = await InfoNotificationModel.find(query, { __v: 0 }).sort({ createdAt: -1 }).lean()

  return notifications.map(({ _id, ...notification }) => ({
    ...notification,
    id: String(_id)
  }))
}

export const getInfoNotificationState = async (userId: MongoIdType, language: AppLanguageType) => {
  const normalizedUserId = normalizeObjectId(userId)
  const state = await InfoNotificationStateModel.findOneAndUpdate(
    { userId: normalizedUserId },
    {
      $setOnInsert: {
        userId: normalizedUserId,
        infoNotifications: {}
      }
    },
    {
      upsert: true,
      new: true
    }
  ).lean()

  if (!state) {
    throw new AppError(REQ_STATUS.server, localizedText(INFO_NOTIFICATION_STATE_I18N.stateNotFound, language))
  }

  return state
}

export const getInitialInfoNotificationMap = async (createdAfter = Date.now()): Promise<InfoNotificationMapType> => {
  const notifications = await getActiveInfoNotifications({ createdAfter })
  const result: InfoNotificationMapType = {
    [WELCOME_INFO_NOTIFICATION_ID]: 'unread'
  }

  notifications.forEach(({ id }) => {
    result[id] = 'unread'
  })

  return result
}

export const getUserInfoNotificationMap = async (userId: MongoIdType, language: AppLanguageType) => {
  const state = await getInfoNotificationState(userId, language)

  if (!state.infoNotifications) {
    return {}
  }

  return Object.fromEntries(Object.entries(state.infoNotifications))
}

export const getUserActiveInfoNotifications = async (
  userId: string,
  language: AppLanguageType
): Promise<IUserInfoNotification[]> => {
  const map = await getUserInfoNotificationMap(userId, language)
  const ids = Object.keys(map)
  const notifications = await getActiveInfoNotifications({ ids })

  return notifications.flatMap((notification) => {
    const status = map[notification.id]

    if (!status) {
      return []
    }

    return [{ ...notification, status }]
  })
}

export const updateInfoNotificationStateStatus = async ({
  userId,
  notificationId,
  status
}: {
  userId: MongoIdType
  notificationId: string
  status: InfoNotificationStatusType
}) => {
  await InfoNotificationStateModel.updateOne(
    { userId: normalizeObjectId(userId) },
    { $set: { [`infoNotifications.${notificationId}`]: status } },
    { upsert: true }
  )
}

export const emitInfoNotificationToUsers = async ({
  userIds,
  notification
}: {
  userIds: string[]
  notification: IUserInfoNotification
}) => {
  if (!userIds.length) {
    return
  }

  const sockets = await getSocketsByUserIds(userIds)

  sockets.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActionsType>('info-notification-received', notification)
  })
}

export const publishInfoNotificationToAllUsers = async (
  notificationId: string,
  language: AppLanguageType,
  publishAgain = false
) => {
  const notification = await InfoNotificationModel.findById(notificationId).lean()

  if (!notification) {
    throw new AppError(REQ_STATUS.notFound, localizedText(INFO_NOTIFICATION_SHARED_I18N.notFound, language))
  }

  const publishedAt = Date.now()

  await InfoNotificationModel.updateOne({ _id: notificationId }, { $set: { isActive: true, updatedAt: publishedAt } })

  const users = await UserModel.find().select('_id').lean()
  const states = await InfoNotificationStateModel.find().select('userId infoNotifications').lean()
  const stateByUserId = new Map(states.map((state) => [String(state.userId), state]))
  const updateRequests: Promise<unknown>[] = []
  const recipientUserIds: string[] = []

  users.forEach((user) => {
    const userId = String(user._id)
    const state = stateByUserId.get(userId)
    const userAlreadyHasInfoNotification = Boolean(
      state?.infoNotifications && notificationId in Object(state.infoNotifications)
    )

    if (userAlreadyHasInfoNotification && !publishAgain) {
      return
    }

    recipientUserIds.push(userId)
    updateRequests.push(
      updateInfoNotificationStateStatus({
        userId: user._id,
        notificationId,
        status: 'unread'
      })
    )
  })

  await Promise.all(updateRequests)
  await emitInfoNotificationToUsers({
    userIds: recipientUserIds,
    notification: {
      ...notification,
      id: String(notification._id),
      isActive: true,
      updatedAt: publishedAt,
      status: 'unread'
    }
  })
}

export const loadInfoNotificationFixtures = async () => {
  const results = await Promise.all(
    INFO_NOTIFICATION_FIXTURES.map(async (fixture) => {
      const existingNotification = await InfoNotificationModel.findById(fixture._id, { _id: 1 }).lean()

      if (existingNotification) {
        return 'skipped'
      }

      await InfoNotificationModel.create(fixture)
      return 'created'
    })
  )
  const created = results.filter((result) => result === 'created').length
  const skipped = results.filter((result) => result === 'skipped').length

  log.info(`-Info notification fixtures processed: created=${created}, skipped=${skipped}, failed=0`)
}

export const emitInfoNotificationStatusUpdated = (socketId: string, payload: IEventInfoNotificationStatusUpdated) => {
  getIO().to(socketId).emit<SocketActionsType>('info-notification-status-updated', payload)
}

export const requireInfoNotification = async (id: string, language: AppLanguageType) => {
  const notification = await InfoNotificationModel.findById(id).lean()

  if (!notification) {
    throw new AppError(REQ_STATUS.notFound, localizedText(INFO_NOTIFICATION_SHARED_I18N.notFound, language))
  }

  return notification
}
