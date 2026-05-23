import {
  CHAT_KIND,
  CHAT_ROOM_GROUP_MEMBER_LIMIT,
  CHAT_ROOM_NAME_MAX_LENGTH,
  type ChatRoomSchema,
  type EventChatRoomDeleted,
  type EventChatRoomLeft,
  type EventDeleteChatRoom,
  type EventLeaveChatRoom,
  type EventMutedChatRoomsUpdated,
  type KnownUser,
  type MessageDocument,
  type EventGetRoom,
  type EventPinnedChatRoomsUpdated,
  type EventUpdateMutedChatRoom,
  type EventUpdatePinnedChatRoom,
  type EventUpdatePinnedChatRoomOrder,
  MESSAGE_STATUS_VALUE,
  PINNED_CHAT_ROOM_LIMIT,
  REQ_STATUS,
  USER_CHAT_ROOM_LIMIT,
  buildAvatarId,
  isAcceptedContactInteraction,
  isRoomAdmin,
  isRoomGroup,
  isRoomPrivate
} from 'global-shared'
import intersection from 'lodash/intersection'
import union from 'lodash/union'
import without from 'lodash/without'

import { AppError } from 'src/shared/lib/app-error'

import { deleteBucketFilesByName } from '../media/media.service'
import { MessageModel } from '../messages/messages.model'
import { transformMessageForUser } from '../messages/messages.service'
import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import { ChatRoomModel } from './chat-rooms.model'
import type { ChatRoomSchemaWithObjectId, TransformRoomForUserParams } from './chat-rooms.types'

export const checkContactsExistence = async (selfId: string, contactIds: string[]) => {
  const [self, contacts] = await Promise.all([
    UserModel.findById(selfId, { 'personal.contacts': 1 }),
    UserModel.find({ _id: { $in: contactIds } }, { 'personal.contacts': 1 })
  ])

  if (!self || contacts.length !== contactIds.length) {
    return false
  }

  const contactById = new Map(contacts.map((contact) => [String(contact._id), contact]))

  return contactIds.every((contactId) => {
    const selfContact = self.personal.contacts[contactId]
    const user = contactById.get(contactId)

    if (!user) return false

    const userContact = user.personal.contacts[selfId]
    const isSelfContactAccepted = isAcceptedContactInteraction(selfContact?.interaction)
    const isUserContactAccepted = isAcceptedContactInteraction(userContact?.interaction)

    return isSelfContactAccepted && isUserContactAccepted
  })
}

export const validateCreateChatRoomLimits = async (userIds: string[], chatName?: string) => {
  const users = await UserModel.find({ _id: { $in: userIds } }, { 'personal.chatRooms': 1 }).lean()
  const isLimitReached = users.some((user) => user.personal.chatRooms.length >= USER_CHAT_ROOM_LIMIT)

  if (isLimitReached) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomLimitReached)
  }

  if (userIds.length > CHAT_ROOM_GROUP_MEMBER_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomMemberLimitReached)
  }

  if (chatName && chatName.length > CHAT_ROOM_NAME_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomNameTooLong)
  }
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
        status: MESSAGE_STATUS_VALUE.DELIVERED
      }
    }
  })
}

const resolvePinnedChatRoomIds = (currentIds: string[], roomId: string, isPinned: boolean) => {
  if (!isPinned) return without(currentIds, roomId)

  return [roomId, ...without(currentIds, roomId)]
}

const resolveMutedChatRoomIds = (currentIds: string[], roomId: string, isMuted: boolean) => {
  if (!isMuted) return without(currentIds, roomId)

  return [roomId, ...without(currentIds, roomId)]
}

const resolvePinnedChatRoomOrder = (currentIds: string[], incomingIds: string[]) => {
  const orderedIds = intersection(incomingIds, currentIds)
  return union(orderedIds, currentIds)
}

export const resolveKnownUsers = async (userIds: string[], presenceService: PresenceService): Promise<KnownUser[]> => {
  if (!userIds.length) return []

  const [users, onlineMap] = await Promise.all([
    UserModel.find({ _id: { $in: userIds } }, { 'public.nickname': 1, 'public.lastSeen': 1 }).lean(),
    presenceService.onlineMapByUserIds(userIds)
  ])
  const userById = new Map(users.map((user) => [String(user._id), user]))

  return userIds.flatMap((id) => {
    const user = userById.get(id)

    if (!user) return []

    return [
      {
        id,
        nickname: user.public.nickname,
        online: onlineMap.get(id) ?? false,
        lastSeen: user.public.lastSeen
      }
    ]
  })
}

const emitKnownUsersToUser = async (userId: string, roomUserIds: string[], presenceService: PresenceService) => {
  const knownUsers = await resolveKnownUsers(
    roomUserIds.filter((id) => id !== userId),
    presenceService
  )

  emitToUsers([userId], 'known-users-updated', knownUsers)
}

export const updatePinnedChatRoom = async (userId: string, { roomId, isPinned }: EventUpdatePinnedChatRoom) => {
  const user = await UserModel.findOne(
    { _id: userId, 'personal.chatRooms': roomId },
    { 'personal.pinnedChatRoomIds': 1 }
  ).lean()

  if (!user) {
    return
  }

  const currentPinnedChatRoomIds = user.personal.pinnedChatRoomIds
  const isAlreadyPinned = currentPinnedChatRoomIds.includes(roomId)

  if (isPinned && !isAlreadyPinned && currentPinnedChatRoomIds.length >= PINNED_CHAT_ROOM_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.pinnedChatRoomLimitReached)
  }

  const pinnedChatRoomIds = resolvePinnedChatRoomIds(currentPinnedChatRoomIds, roomId, isPinned)

  await UserModel.updateOne({ _id: userId }, { $set: { 'personal.pinnedChatRoomIds': pinnedChatRoomIds } })

  const payload: EventPinnedChatRoomsUpdated = {
    roomId,
    isPinned,
    pinnedChatRoomIds
  }

  emitToUsers([userId], 'pinned-chat-rooms-updated', payload)
}

export const updatePinnedChatRoomOrder = async (
  userId: string,
  { pinnedChatRoomIds }: EventUpdatePinnedChatRoomOrder
) => {
  if (pinnedChatRoomIds.length > PINNED_CHAT_ROOM_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.pinnedChatRoomLimitReached)
  }

  const user = await UserModel.findById(userId, { 'personal.pinnedChatRoomIds': 1 }).lean()

  if (!user) {
    return
  }

  const nextPinnedChatRoomIds = resolvePinnedChatRoomOrder(user.personal.pinnedChatRoomIds, pinnedChatRoomIds)

  await UserModel.updateOne({ _id: userId }, { $set: { 'personal.pinnedChatRoomIds': nextPinnedChatRoomIds } })

  emitToUsers([userId], 'pinned-chat-rooms-updated', {
    pinnedChatRoomIds: nextPinnedChatRoomIds
  })
}

export const updateMutedChatRoom = async (userId: string, { roomId, isMuted }: EventUpdateMutedChatRoom) => {
  const user = await UserModel.findOne(
    { _id: userId, 'personal.chatRooms': roomId },
    { 'personal.mutedChatRoomIds': 1 }
  ).lean()

  if (!user) {
    return
  }

  const currentMutedChatRoomIds = user.personal.mutedChatRoomIds
  const mutedChatRoomIds = resolveMutedChatRoomIds(currentMutedChatRoomIds, roomId, isMuted)

  await UserModel.updateOne({ _id: userId }, { $set: { 'personal.mutedChatRoomIds': mutedChatRoomIds } })

  const payload: EventMutedChatRoomsUpdated = {
    roomId,
    isMuted,
    mutedChatRoomIds
  }

  emitToUsers([userId], 'muted-chat-rooms-updated', payload)
}

export const deleteChatRoom = async (userId: string, { roomId }: EventDeleteChatRoom) => {
  const room = await ChatRoomModel.findOne({
    _id: roomId,
    users: userId
  })
    .select('adminId chatKind users messages')
    .lean()

  if (!room) {
    return
  }

  const isGroupChatRoom = isRoomGroup(room)
  const isDirectChatRoom = isRoomPrivate(room)
  const canDeleteGroupChatRoom = isGroupChatRoom && isRoomAdmin(room, userId)
  const canDeleteDirectChatRoom = isDirectChatRoom

  if (!canDeleteGroupChatRoom && !canDeleteDirectChatRoom) {
    return
  }

  const { users, messages } = room
  const userIds = users.map(String)
  const messageIds = messages.map(String)
  const deleteChatRoomTasks: Array<Promise<unknown>> = [
    ChatRoomModel.deleteOne({ _id: roomId }).exec(),
    MessageModel.deleteMany({ _id: { $in: messageIds } }).exec(),
    UserModel.updateMany(
      { _id: { $in: userIds } },
      {
        $pull: {
          'personal.chatRooms': roomId,
          'personal.pinnedChatRoomIds': roomId,
          'personal.mutedChatRoomIds': roomId
        }
      }
    ).exec()
  ]

  if (isGroupChatRoom) {
    deleteChatRoomTasks.push(deleteBucketFilesByName('avatar', buildAvatarId(roomId)))
  }

  await Promise.all(deleteChatRoomTasks)

  const payload: EventChatRoomDeleted = {
    roomId
  }

  emitToUsers(userIds, 'chat-room-deleted', payload)
}

export const transformRoomForUser = async ({
  userId,
  room,
  pinnedChatRoomIds,
  mutedChatRoomIds
}: TransformRoomForUserParams): Promise<EventGetRoom> => {
  const normalizedRoom = room as ChatRoomSchemaWithObjectId
  const { _id, users: roomUsers, chatKind: roomChatKind, messages } = normalizedRoom
  const roomId = String(_id)
  const users = roomUsers.map((id) => String(id)).filter((id) => id !== userId)
  const chatKind = roomChatKind ?? (roomUsers.length > 2 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT)
  const avatarId = buildAvatarId(isRoomPrivate({ chatKind }) ? users[0] : roomId)
  const lastMessageId = messages[messages.length - 1] ?? null
  const pinnedOrder = pinnedChatRoomIds.indexOf(roomId)
  const [unreadMessagesQuantity, previewMessage] = await Promise.all([
    countUnreadRoomMessages(userId, messages),
    lastMessageId ? MessageModel.findById(lastMessageId).select('-__v').lean<MessageDocument>() : null
  ])

  return {
    id: roomId,
    adminId: normalizedRoom.adminId,
    createdAt: normalizedRoom.createdAt,
    chatName: normalizedRoom.chatName,
    chatKind,
    avatarId,
    lastMessageId,
    unreadMessagesQuantity,
    isPinned: pinnedOrder !== -1,
    pinnedOrder: pinnedOrder === -1 ? null : pinnedOrder,
    isMuted: mutedChatRoomIds.includes(roomId),
    users,
    messages,
    previewMessage: previewMessage ? transformMessageForUser(previewMessage, userId) : null
  } satisfies EventGetRoom
}

const emitRoomToUsers = async (
  userIds: string[],
  room: ChatRoomSchema,
  presenceService: PresenceService,
  eventName: 'room-data-updated' | 'new-room-added'
) => {
  await Promise.all(
    userIds.map(async (userId) => {
      const userData = await UserModel.findById(userId).lean()

      if (!userData) {
        return
      }

      const transformedRoom = await transformRoomForUser({
        userId,
        room,
        pinnedChatRoomIds: userData.personal.pinnedChatRoomIds,
        mutedChatRoomIds: userData.personal.mutedChatRoomIds
      })

      await emitKnownUsersToUser(userId, room.users, presenceService)
      emitToUsers([userId], eventName, transformedRoom)
    })
  )
}

export const emitRoomDataToUsers = async (
  userIds: string[],
  room: ChatRoomSchema,
  presenceService: PresenceService
) => {
  await emitRoomToUsers(userIds, room, presenceService, 'room-data-updated')
}

export const leaveChatRoom = async (
  userId: string,
  { roomId, nextAdminId }: EventLeaveChatRoom,
  presenceService: PresenceService
) => {
  const room = await ChatRoomModel.findOne({
    _id: roomId,
    users: userId,
    chatKind: CHAT_KIND.GROUP
  })
    .select('-__v')
    .lean<ChatRoomSchemaWithObjectId>()

  if (!room) {
    return
  }

  const { users, adminId } = room
  const userIds = users.map(String)
  const remainingUserIds = userIds.filter((id) => id !== userId)
  const isAdminLeaving = isRoomAdmin(room, userId)

  let nextRoomAdminId = adminId

  if (isAdminLeaving) {
    if (!nextAdminId) {
      throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.leaveChatRoomNewAdminRequired)
    }

    if (!remainingUserIds.includes(nextAdminId)) {
      throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.leaveChatRoomInvalidNewAdmin)
    }

    nextRoomAdminId = nextAdminId
  }

  const [updatedRoom] = await Promise.all([
    ChatRoomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $set: {
          adminId: nextRoomAdminId,
          users: remainingUserIds
        }
      },
      { new: true }
    )
      .select('-__v')
      .lean<ChatRoomSchemaWithObjectId>(),
    UserModel.updateOne(
      { _id: userId },
      {
        $pull: {
          'personal.chatRooms': roomId,
          'personal.pinnedChatRoomIds': roomId,
          'personal.mutedChatRoomIds': roomId
        }
      }
    )
  ])
  const payload: EventChatRoomLeft = {
    roomId
  }

  emitToUsers([userId], 'chat-room-left', payload)

  if (updatedRoom) {
    await emitRoomDataToUsers(remainingUserIds, updatedRoom, presenceService)
  }
}

export const emitNewRoomToUsers = async (userIds: string[], room: ChatRoomSchema, presenceService: PresenceService) => {
  await emitRoomToUsers(userIds, room, presenceService, 'new-room-added')
}
