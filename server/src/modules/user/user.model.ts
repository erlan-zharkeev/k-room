import { USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH, USER_ROLES } from 'global-shared'
import { model, Schema } from 'mongoose'

import type { UserPersonalData, UserPublicData, UserSchema, UserSystemData } from './types'

const systemSchema = new Schema<UserSystemData>(
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

const personalSchema = new Schema<UserPersonalData>(
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
    },
    pinnedChatRoomIds: {
      type: [String],
      required: true,
      default: []
    },
    mutedChatRoomIds: {
      type: [String],
      required: true,
      default: []
    }
  },
  { _id: false, minimize: false }
)

const publicSchema = new Schema<UserPublicData>(
  {
    avatarId: {
      type: String,
      required: false,
      default: null
    },
    nickname: {
      type: String,
      unique: true,
      required: true,
      minlength: USER_NICKNAME_MIN_LENGTH,
      maxlength: USER_NICKNAME_MAX_LENGTH
    },
    lastSeen: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { _id: false }
)

const userSchema = new Schema<UserSchema>(
  {
    system: systemSchema,
    personal: personalSchema,
    public: publicSchema
  },
  { timestamps: true, minimize: false, versionKey: false }
)

export const UserModel = model<UserSchema>('User', userSchema, 'user')
