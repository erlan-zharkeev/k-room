import { Schema, model } from 'mongoose'
import { User } from './../../../types/'

export interface IUserSchema extends User {
  socketId: string
  confirmed: Boolean
  confirmAttempts: number
  _id: string
}

export const userSchema = new Schema<IUserSchema>({
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
  avatar: {
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
  }
})

export const UserModel = model('User', userSchema)
