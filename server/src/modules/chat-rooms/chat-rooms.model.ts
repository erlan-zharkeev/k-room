import { CHAT_KIND, type IChatRoomSchema } from 'global-shared'
import { model, Schema } from 'mongoose'

const chatRoomSchema = new Schema<IChatRoomSchema>({
  chatName: {
    type: String,
    required: false,
    default: ''
  },
  adminId: {
    type: String,
    required: true
  },
  chatKind: {
    type: String,
    enum: Object.values(CHAT_KIND),
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

export const ChatRoomModel = model<IChatRoomSchema>('IChatRoom', chatRoomSchema, 'chat-room')
