import type { IChatRoom, IChatRoomSchema } from 'global-shared'

import { emitToUsers } from '../presence/presence.service'
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

export const transformRoomForUser = ({ userId, room }: ITransformRoomForUserParams) => {
  const normalizedRoom = room as IChatRoomSchemaWithObjectId
  const users = (normalizedRoom.users ?? []).map((id) => String(id)).filter((id) => id !== userId)

  return {
    id: String(normalizedRoom._id),
    authorId: normalizedRoom.authorId,
    chatName: normalizedRoom.chatName,
    lastMessageId: normalizedRoom.messages[normalizedRoom.messages.length - 1] ?? null,
    users,
    messages: normalizedRoom.messages
  } satisfies IChatRoom
}

export const emitNewRoomToUsers = async (userIds: string[], room: IChatRoomSchema) => {
  await Promise.all(
    userIds.map(async (userId) => {
      const userData = await UserModel.findById(userId).lean()

      if (!userData) {
        return
      }

      const transformedRoom = transformRoomForUser({ userId, room })

      emitToUsers([userId], 'new-room-added', transformedRoom)
    })
  )
}
