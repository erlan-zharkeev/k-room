import { Schema } from 'mongoose'

import { UserDevice } from './types'

export const deviceSchema = new Schema<UserDevice>(
  {
    refreshToken: {
      type: String,
      required: true
    },
    socketId: {
      type: String,
      required: true
    }
  },
  { _id: false }
)
