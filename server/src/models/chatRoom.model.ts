import { Schema, model } from 'mongoose'
import { DBChatRoom } from '../../../types'

export const chatRoomModel = new Schema<DBChatRoom>({
  chatName: {
    type: String,
    required: false
  },
  avatarPath: {
    type: String,
    required: false
  },
  authorId: {
    type: String,
    required: true
  },
  multiple: {
    type: Boolean,
    required: false
  },
  users: {
    type: [String],
    required: true,
    default: []
  },
  messages: {
    type: [String],
    required: false,
    default: []
  }
})

export const ChatRoomModel = model('ChatRoom', chatRoomModel)
