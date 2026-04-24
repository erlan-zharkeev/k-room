import { model, Schema } from 'mongoose'
import { USER_ROLES } from 'shared'

import type { IUserPersonalData, IUserPublicData, IUserSchema, IUserSystemData } from './types'

const systemSchema = new Schema<IUserSystemData>(
  {
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      default: 'user'
    },
    device: {
      type: Schema.Types.Mixed,
      default: {}
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false
    },
    confirmAttempts: {
      type: Number,
      required: true,
      default: 3
    },
    password: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: false
    }
  },
  { _id: false }
)

const personalSchema = new Schema<IUserPersonalData>(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    contacts: {
      type: Schema.Types.Mixed,
      default: {}
    },
    chatRooms: {
      type: [String],
      required: true,
      default: []
    }
  },
  { _id: false }
)

const publicSchema = new Schema<IUserPublicData>(
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

const userSchema = new Schema<IUserSchema>(
  {
    system: systemSchema,
    personal: personalSchema,
    public: publicSchema
  },
  { timestamps: true }
)

export const UserModel = model<IUserSchema>('User', userSchema, 'user')
