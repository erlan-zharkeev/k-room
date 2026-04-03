import { model, Schema } from 'mongoose'

import { IChatRoomSchema } from 'common'

const chatRoomSchema = new Schema<IChatRoomSchema>(
  {
    chatName: {
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
  {}
)

export const ChatRoomModel = model('IChatRoom', chatRoomSchema, 'chat-room')
