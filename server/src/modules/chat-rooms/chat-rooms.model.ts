import { CHAT_KIND, CHAT_ROOM_NAME_MAX_LENGTH, type ChatRoomSchema } from 'global-shared'
import { model, Schema } from 'mongoose'

const chatRoomSchema = new Schema<ChatRoomSchema>({
  chatName: {
    type: String,
    required: false,
    maxlength: CHAT_ROOM_NAME_MAX_LENGTH,
    default: ''
  },
  adminId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    required: true,
    default: Date.now
  },
  chatKind: {
    type: String,
    enum: Object.values(CHAT_KIND),
    required: true
  },
  avatarId: {
    type: String,
    required: false,
    default: null
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

export const ChatRoomModel = model<ChatRoomSchema>('ChatRoom', chatRoomSchema, 'chat-room')
