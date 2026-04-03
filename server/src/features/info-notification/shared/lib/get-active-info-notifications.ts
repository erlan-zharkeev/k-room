import { IInfoNotification } from 'common'

import { InfoNotificationModel } from 'src/entities/info-notification'

export const getActiveInfoNotifications = async ({
  ids,
  createdAfter
}: {
  ids?: string[]
  createdAfter?: number
} = {}): Promise<IInfoNotification[]> => {
  if (ids && ids.length === 0) return []

  const query: Record<string, unknown> = { isActive: true }

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
