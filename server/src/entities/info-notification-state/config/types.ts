import { Types } from 'mongoose'

import { InfoNotificationMapType } from 'common'

export interface IInfoNotificationStateSchema {
  _id: string
  userId: string
  infoNotifications: InfoNotificationMapType
}

export type InfoNotificationStateDocumentType = Omit<IInfoNotificationStateSchema, '_id' | 'userId'> & {
  _id: Types.ObjectId
  userId: Types.ObjectId
}
