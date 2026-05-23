import type { ChatRoomSchema } from 'global-shared'
import type { Types } from 'mongoose'

export interface TransformRoomForUserParams {
  userId: string
  room: ChatRoomSchema
  pinnedChatRoomIds: string[]
  mutedChatRoomIds: string[]
}

export interface ChatRoomSchemaWithObjectId extends ChatRoomSchema {
  _id: Types.ObjectId
}
