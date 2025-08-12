import { Schema, model } from 'mongoose'
import type { IChatRoomSchema } from 'common-types'

const chatRoomSchema = new Schema<IChatRoomSchema>(
  {
    chatName: {
      type: String,
      required: false,
      default: ''
    },
    avatar: {
      type: String,
      required: false,
      default: ''
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
  },
  { timestamps: true }
)

export const ChatRoomModel = model('IChatRoom', chatRoomSchema, 'chatroom')
