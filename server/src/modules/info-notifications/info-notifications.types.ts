import type { InfoNotificationMapType, IInfoNotification } from 'global-shared'
import type { Types } from 'mongoose'

export interface IInfoNotificationDocument extends Omit<IInfoNotification, 'id'> {
  _id: Types.ObjectId
}

export interface IInfoNotificationStateSchema {
  _id: string
  userId: string
  infoNotifications: InfoNotificationMapType
}

export type InfoNotificationStateDocumentType = Omit<IInfoNotificationStateSchema, '_id' | 'userId'> & {
  _id: Types.ObjectId
  userId: Types.ObjectId
}
