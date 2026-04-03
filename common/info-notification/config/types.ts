import type { LocalizedTextType } from 'common/language'

import { INFO_NOTIFICATION_STATUS } from './constants'

export type InfoNotificationStatusType = (typeof INFO_NOTIFICATION_STATUS)[number]
export type InfoNotificationType = InfoNotificationStatusType

export interface IInfoNotification {
  id: number
  title: LocalizedTextType
  content: LocalizedTextType<string[]>
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export type InfoNotificationMapType = Record<number, InfoNotificationType>

export interface IMarkAsReadPayload {
  id: number
}
