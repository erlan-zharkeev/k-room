import { Schema } from 'mongoose'

import type { IUserDevice } from './../config'

export const deviceSchema = new Schema<IUserDevice>(
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
