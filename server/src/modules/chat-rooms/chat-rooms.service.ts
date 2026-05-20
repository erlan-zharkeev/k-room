import {
  CHAT_KIND,
  type IChatRoomSchema,
  type IDBMessage,
  type IEventGetRoom,
  type IEventPinnedChatRoomsUpdated,
  type IEventUpdatePinnedChatRoom,
  MEDIA_AVATAR_FILENAME_PREFIX
} from 'global-shared'

import { MessageModel } from '../messages/messages.model'
import { transformMessageForUser } from '../messages/messages.service'
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

const resolvePinnedChatRoomIds = (currentIds: string[], roomId: string, isPinned: boolean) => {
  if (!isPinned) return currentIds.filter((id) => id !== roomId)

  return [roomId, ...currentIds.filter((id) => id !== roomId)]
}

export const updatePinnedChatRoom = async (
  userId: string,
  { roomId, isPinned }: IEventUpdatePinnedChatRoom
) => {
  const user = await UserModel.findOne(
    { _id: userId, 'personal.chatRooms': roomId },
    { 'personal.pinnedChatRoomIds': 1 }
  ).lean()

  if (!user) {
    return
  }

  const pinnedChatRoomIds = resolvePinnedChatRoomIds(user.personal.pinnedChatRoomIds ?? [], roomId, isPinned)

  await UserModel.updateOne({ _id: userId }, { $set: { 'personal.pinnedChatRoomIds': pinnedChatRoomIds } })

  const payload: IEventPinnedChatRoomsUpdated = {
    roomId,
    isPinned,
    pinnedChatRoomIds
  }

  emitToUsers([userId], 'pinned-chat-rooms-updated', payload)
}

export const transformRoomForUser = async ({
  userId,
  room,
  pinnedChatRoomIds = []
}: ITransformRoomForUserParams): Promise<IEventGetRoom> => {
  const normalizedRoom = room as IChatRoomSchemaWithObjectId
  const roomId = String(normalizedRoom._id)
  const users = (normalizedRoom.users ?? []).map((id) => String(id)).filter((id) => id !== userId)
  const chatKind = normalizedRoom.chatKind ?? (normalizedRoom.users.length > 2 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT)
  const avatarId = `${MEDIA_AVATAR_FILENAME_PREFIX}${chatKind === CHAT_KIND.DIRECT ? users[0] : roomId}`
  const messages = normalizedRoom.messages ?? []
  const lastMessageId = messages[messages.length - 1] ?? null
  const pinnedOrder = pinnedChatRoomIds.indexOf(roomId)
  const [unreadMessagesQuantity, previewMessage] = await Promise.all([
    countUnreadRoomMessages(userId, messages),
    lastMessageId ? MessageModel.findById(lastMessageId).select('-__v').lean<IDBMessage>() : null
  ])

  return {
    id: roomId,
    authorId: normalizedRoom.authorId,
    chatName: normalizedRoom.chatName,
    chatKind,
    avatarId,
    lastMessageId,
    unreadMessagesQuantity,
    isPinned: pinnedOrder !== -1,
    pinnedOrder: pinnedOrder === -1 ? null : pinnedOrder,
    users,
    messages,
    previewMessage: previewMessage ? transformMessageForUser(previewMessage, userId) : null
  } satisfies IEventGetRoom
}

export const emitNewRoomToUsers = async (userIds: string[], room: IChatRoomSchema) => {
  await Promise.all(
    userIds.map(async (userId) => {
      const userData = await UserModel.findById(userId).lean()

      if (!userData) {
        return
      }

      const transformedRoom = await transformRoomForUser({
        userId,
        room,
        pinnedChatRoomIds: userData.personal.pinnedChatRoomIds ?? []
      })

      emitToUsers([userId], 'new-room-added', transformedRoom)
    })
  )
}
