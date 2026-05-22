import { Schema } from 'mongoose'

import { UserPublicData } from './types'

export const publicSchema = new Schema<UserPublicData>(
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
