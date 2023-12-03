import { serverConstants } from '../../server-constants'
import { UserModel, MessageModel } from '../../models'
import { getUserById } from '../../socket'
import { DBChatRoom, SystemMessages, MessageStatus, DBMessage, ChatRoom } from '../../@types'
import { transformMessageForUsers } from './transform-message-for-users'

export const transformRoomForUser = async ({ userId, room }: { userId: string; room: DBChatRoom }) => {
  let { chatName, users, avatarPath, multiple, authorId, _id, messages, blocked } = room
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
    const systemMessagesMap = serverConstants.messages.system.reduce((acc, message) => {
      const name = message.name
      acc[name] = message.id
      return acc
    }, {} as Record<SystemMessages, string>)

    const isUserAuthor = room.authorId === userId

    let systemMessageId = isUserAuthor ? systemMessagesMap['author-created-chat'] : systemMessagesMap['invite-message']
    if (multiple) {
      systemMessageId = isUserAuthor
        ? systemMessagesMap['author-created-group-chat']
        : systemMessagesMap['invite-group-chat']
    }

    const status = isUserAuthor ? MessageStatus.none : MessageStatus.delivered
    await MessageModel.updateOne({ _id: systemMessageId }, { $set: { usersMetaData: { id: userId, status } } })

    messages?.push(systemMessageId)
  }

  const fullBodyMessages: Array<DBMessage> = await MessageModel.find({ _id: { $in: messages } })

  const transformedMessages = fullBodyMessages.map((message) => transformMessageForUsers(message, userId))
  const isRoomBlocked = authorId === userId && blocked
  const result: ChatRoom = {
    id: String(_id),
    authorId,
    chatName,
    avatarPath,
    hasOnline,
    blocked: isRoomBlocked,
    users: shortUserList,
    messages: transformedMessages,
    multiple
  }
  return result
}
