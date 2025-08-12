import { MessageModel } from '../../models'
import type { IDBMessage, IChatRoom, IChatRoomSchema } from 'common-types'
import { transformMessageForUsers } from './transform-message-for-users'
import { ObjectId } from 'mongoose'
import { getUserById } from '../../socket'
import { UserModel } from 'entities/user'

export const transformRoomForUser = async ({ userId, room }: { userId: string; room: IChatRoomSchema }) => {
  let { chatName, users, avatar, authorId, messages, _id } = room as IChatRoomSchema & { _id: ObjectId }
  // Remove self id
  users?.splice(users?.indexOf(userId), 1)
  const contactList = await UserModel.find({ _id: { $in: users } }, { _id: 1 })
  const contactIds = contactList.map((user) => String(user._id))
  const fullBodyMessages: Array<IDBMessage> = await MessageModel.find({ _id: { $in: messages } })
  const transformedMessages = fullBodyMessages.map((message) => transformMessageForUsers(message, userId))
  const result: IChatRoom = {
    id: String(_id),
    authorId,
    chatName,
    avatar,
    users: contactIds,
    messages: transformedMessages
  }
  if (users.length <= 1) {
    const firstContact = await getUserById(users[0])
    if (!firstContact) return
    result.chatName = firstContact.username
    result.avatar = firstContact.avatar
  }

  return result
}
