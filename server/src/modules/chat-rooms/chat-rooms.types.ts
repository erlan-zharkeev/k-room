import type { IChatRoomSchema } from 'global-shared'
import type { ObjectId } from 'mongoose'

export interface ITransformRoomForUserParams {
  userId: string
  room: IChatRoomSchema
  pinnedChatRoomIds?: string[]
}

export interface IChatRoomSchemaWithObjectId extends IChatRoomSchema {
  _id: ObjectId
}
