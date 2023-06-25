import { ChatRoom, DBChatRoom, DBMessage } from '../../../../types'
import { getUserById } from '../../socket/helpers/getters/getUserById'
import constants from '../../constants'
import { MessageModel } from '../../models/message.model'
import { UserModel } from '../../models/user.model'
import { transformMessageForUsers } from './transformMessageForUsers'
import { SystemMessages } from '../../types/Constants'

export const transformRoomForUser = async ({ userId, room }: { userId: string; room: DBChatRoom }) => {
  let { chatName, users, avatarPath, multiple, authorId, _id, messages } = room
  let hasOnline = false

  if (!multiple) {
    const interlocutorId = users?.find((id) => id !== userId) ?? ''
    const userData = await getUserById(interlocutorId)
    chatName = userData?.username ?? userData?.id
    avatarPath = userData?.avatarPath
    hasOnline = Boolean(userData?.online)
  }
  users?.splice(users?.indexOf(userId), 1)
  const userList = await UserModel.find({ _id: { $in: users } })
  const shortUserList = userList.map((user) => {
    return {
      id: user.id,
      username: user.username,
      avatarPath: user.avatarPath
    }
  })
  const setInviteMessage = messages.length < 1
  if (setInviteMessage) {
    const systemMessagesMap = constants.messages.system.reduce((acc, message) => {
      const name = message.name
      acc[name] = message.id
      return acc
    }, {} as { [key in SystemMessages]: string })

    const isUserAuthor = room.authorId === userId

    let systemMessageId = isUserAuthor ? systemMessagesMap['author-created-chat'] : systemMessagesMap['invite-message']
    if (multiple) {
      systemMessageId = isUserAuthor
        ? systemMessagesMap['author-created-group-chat']
        : systemMessagesMap['invite-group-chat']
    }
    messages?.push(systemMessageId)
  }

  const fullBodyMessages: Array<DBMessage> = await MessageModel.find({ _id: { $in: messages } })

  const transformedMessages = fullBodyMessages.map((message) => transformMessageForUsers(message, userId))
  const blocked = authorId === userId && room.messages?.length < 2
  const result: ChatRoom = {
    id: String(_id),
    authorId,
    chatName,
    avatarPath,
    hasOnline,
    blocked,
    users: shortUserList,
    messages: transformedMessages,
    multiple
  }
  return result
}
