import { Schema, model } from 'mongoose'
import { IChatRoomSchema } from '../@types'

const chatRoomSchema = new Schema<IChatRoomSchema>({
  chatName: {
    type: String,
    required: false,
    default: ''
  },
  avatarPath: {
    type: String,
    required: false,
    default: ''
  },
  multiple: {
    type: Boolean,
    required: false,
    default: false
  },
  authorId: {
    type: String,
    required: true
  },
  users: {
    type: [String],
    required: true,
    default: []
  },
  messages: {
    type: [String],
    required: true,
    default: []
  }
})

export const ChatRoomModel = model('IChatRoom', chatRoomSchema)
