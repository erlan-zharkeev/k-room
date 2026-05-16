import { CHAT_KIND, type IChatRoom, type IChatRoomSchema } from 'global-shared'

import { MessageModel } from '../messages/messages.model'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import type { IChatRoomSchemaWithObjectId, ITransformRoomForUserParams } from './chat-rooms.types'

export const checkContactsExistence = async (selfId: string, contactIds: string[]) => {
  const [self, contacts] = await Promise.all([
    UserModel.findById(selfId, { 'personal.contacts': 1 }),
    UserModel.find({ _id: { $in: contactIds } }, { 'personal.contacts': 1 })
  ])

  if (!self || contacts.length !== contactIds.length) {
    return false
  }

  return contactIds.every((contactId) => {
    const selfContact = self.personal.contacts?.[contactId]
    const user = contacts.find((contact) => String(contact._id) === contactId)
    const userContact = user?.personal.contacts?.[selfId]

    return selfContact?.interaction === 'invite-accepted' && userContact?.interaction === 'invite-accepted'
  })
}

export const setRoomToUsers = async (roomId: string, userIds: string[]) => {
  await Promise.all(
    userIds.map(async (userId) => {
      await UserModel.updateOne({ _id: userId }, { $push: { 'personal.chatRooms': roomId } })
    })
  )
}

const countUnreadRoomMessages = async (userId: string, messageIds: string[]) => {
  if (!messageIds.length) return 0

  return MessageModel.countDocuments({
    _id: { $in: messageIds },
    authorId: { $ne: userId },
    usersMetaData: {
      $elemMatch: {
        id: userId,
        status: 'delivered'
      }
    }
  })
}

export const transformRoomForUser = async ({ userId, room }: ITransformRoomForUserParams) => {
  const normalizedRoom = room as IChatRoomSchemaWithObjectId
  const roomId = String(normalizedRoom._id)
  const users = (normalizedRoom.users ?? []).map((id) => String(id)).filter((id) => id !== userId)
  const chatKind = normalizedRoom.chatKind ?? (normalizedRoom.users.length > 2 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT)
  const avatarId = `avatar.${chatKind === CHAT_KIND.DIRECT ? users[0] : roomId}`
  const messages = normalizedRoom.messages ?? []

  return {
    id: roomId,
    authorId: normalizedRoom.authorId,
    chatName: normalizedRoom.chatName,
    chatKind,
    avatarId,
    lastMessageId: messages[messages.length - 1] ?? null,
    unreadMessagesQuantity: await countUnreadRoomMessages(userId, messages),
    users,
    messages
  } satisfies IChatRoom
}

export const emitNewRoomToUsers = async (userIds: string[], room: IChatRoomSchema) => {
  await Promise.all(
    userIds.map(async (userId) => {
      const userData = await UserModel.findById(userId).lean()

      if (!userData) {
        return
      }

      const transformedRoom = await transformRoomForUser({ userId, room })

      emitToUsers([userId], 'new-room-added', transformedRoom)
    })
  )
}
