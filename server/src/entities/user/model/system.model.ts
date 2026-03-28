import { Schema } from 'mongoose'

import { USER_ROLES } from 'common'

import type { IUserSystemData } from '../config'

import { deviceSchema } from './device.model'

export const systemSchema = new Schema<IUserSystemData>(
  {
    role: {
      type: String,
      enum: USER_ROLES,
      unique: false,
      required: false
    },
    device: {
      type: Map,
      of: deviceSchema,
      default: () => new Map()
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
