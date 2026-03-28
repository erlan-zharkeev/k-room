import { Schema } from 'mongoose'

import type { IUserPublicData } from './../config'

export const publicSchema = new Schema<IUserPublicData>(
  {
    username: {
      type: String,
      required: true
    },
    online: {
      type: Boolean,
      required: true,
      default: false
    },
    lastSeen: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { _id: false }
)
