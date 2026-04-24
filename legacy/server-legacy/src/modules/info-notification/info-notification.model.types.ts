import { IInfoNotification } from 'common'
import { Types } from 'mongoose'

export interface IInfoNotificationDocument extends Omit<IInfoNotification, 'id'> {
  _id: Types.ObjectId
}
