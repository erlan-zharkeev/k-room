import { LocalizedTextType } from 'common/language'

import { INFO_NOTIFICATION_STATUS } from './constants'

export type InfoNotificationStatusType = (typeof INFO_NOTIFICATION_STATUS)[number]

export interface IInfoNotification {
  id: string
  title: LocalizedTextType
  content: LocalizedTextType<string[]>
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export type InfoNotificationMapType = Record<string, InfoNotificationStatusType>

export interface IUserInfoNotification extends IInfoNotification {
  status: InfoNotificationStatusType
}

export interface IMarkInfoNotificationAsReadPayload {
  id: string
}
