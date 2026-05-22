import type { ChatRoomSchemaType } from 'global-shared'
import type { ObjectId } from 'mongoose'

export interface ITransformRoomForUserParams {
  userId: string
  room: ChatRoomSchemaType
  pinnedChatRoomIds?: string[]
}

export interface IChatRoomSchemaWithObjectId extends ChatRoomSchemaType {
  _id: ObjectId
}
