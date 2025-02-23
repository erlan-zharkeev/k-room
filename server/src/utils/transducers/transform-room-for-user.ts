import { UserModel, MessageModel } from '../../models'
import { DBMessage, ChatRoom } from '../../@types'
import { transformMessageForUsers } from './transform-message-for-users'
import { ChatRoomSchemaType } from '../../models/chat-room.model'

export const transformRoomForUser = async ({ userId, room }: { userId: string; room: ChatRoomSchemaType }) => {
  let { chatName, users, avatarPath, multiple, authorId, messages, _id } = room
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
  const fullBodyMessages: Array<DBMessage> = await MessageModel.find({ _id: { $in: messages } })
  const transformedMessages = fullBodyMessages.map((message) => transformMessageForUsers(message, userId))
  const result: ChatRoom = {
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
