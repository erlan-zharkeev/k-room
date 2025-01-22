import { Schema, model } from 'mongoose'
import { IUserSchema } from '../@types'

const userSchema = new Schema<IUserSchema>({
  role: {
    type: String,
    unique: false,
    required: false
  },
  socketId: {
    type: String,
    unique: false,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  refreshToken: {
    type: String,
    unique: false,
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
  },
  avatarPath: {
    type: String,
    required: false
  },
  online: {
    type: Boolean,
    required: false,
    default: false
  },
  lastSeen: {
    type: String,
    required: false
  },
  contacts: {
    type: [String],
    required: false
  },
  chatRooms: {
    type: [],
    required: false
  },
  settings: {
    type: {},
    required: false
  },
  codes: {
    type: {},
    required: false
  },
  infoItems: {
    type: [],
    required: false
  }
})

export const UserModel = model('User', userSchema)
