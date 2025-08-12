import { type IUserPublicData } from 'entities/user'
import { Schema } from 'mongoose'

export const publicSchema = new Schema<IUserPublicData>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    avatar: {
      type: String,
      required: false
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
