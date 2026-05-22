import { CHAT_KIND, type ChatRoomSchemaType } from 'global-shared'
import { model, Schema } from 'mongoose'

const chatRoomSchema = new Schema<ChatRoomSchemaType>({
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

export const ChatRoomModel = model<ChatRoomSchemaType>('IChatRoom', chatRoomSchema, 'chat-room')
