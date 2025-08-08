import type { IUserSystemData } from 'entities/user'
import { Schema } from 'mongoose'

import { deviceSchema } from './device.model'

export const systemSchema = new Schema<IUserSystemData>(
  {
    device: deviceSchema,
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
    }
  },
  { _id: false }
)
