import { Types } from 'mongoose'

import { IInfoNotification } from 'common'

export interface IInfoNotificationDocument extends Omit<IInfoNotification, 'id'> {
  _id: Types.ObjectId
}
