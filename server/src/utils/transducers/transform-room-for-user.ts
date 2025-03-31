import { UserModel, MessageModel } from '../../models'
import { IDBMessage, IChatRoom, IChatRoomSchema } from '../../@types'
import { transformMessageForUsers } from './transform-message-for-users'
import { ObjectId } from 'mongoose'

export const transformRoomForUser = async ({ userId, room }: { userId: string; room: IChatRoomSchema }) => {
  let { chatName, users, avatarPath, multiple, authorId, messages, _id } = room as IChatRoomSchema & { _id: ObjectId }
  // Remove self id
  users?.splice(users?.indexOf(userId), 1)
  const userList = await UserModel.find({ _id: { $in: users } })
  const shortUserList = userList.map((user) => {
    return {
      id: user.id,
      username: user.username,
      avatarPath: user.avatarPath
    }
  })
  const fullBodyMessages: Array<IDBMessage> = await MessageModel.find({ _id: { $in: messages } })
  const transformedMessages = fullBodyMessages.map((message) => transformMessageForUsers(message, userId))
  const result: IChatRoom = {
    id: String(_id),
    authorId,
    chatName,
    avatarPath,
    users: shortUserList,
    messages: transformedMessages,
    multiple: multiple ?? false
  }
  return result
}
