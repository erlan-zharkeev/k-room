import { Schema } from 'mongoose'
import type { IUserSystemData } from 'entities/user'

export const systemSchema = new Schema<IUserSystemData>(
  {
    socketIds: {
      type: [String],
      unique: true,
      required: false
    },
    refreshToken: {
      type: String,
      unique: true,
      required: false
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
    }
  },
  { _id: false }
)
