import { setTimeout as delay } from 'timers/promises'

import {
  CHAT_KIND,
  CHAT_ROOM_GROUP_MEMBER_LIMIT,
  CHAT_ROOM_NAME_MAX_LENGTH,
  type CreateRoomAckPayload,
  type EventChatRoomDeleted,
  type EventCreateRoom,
  type EventChatRoomLeft,
  type EventDeleteChatRoom,
  type EventLeaveChatRoom,
  type EventMutedChatRoomsUpdated,
  type EventUpdateChatRoom,
  type KnownUser,
  type EventGetRoom,
  type EventPinnedChatRoomsUpdated,
  type EventUpdateMutedChatRoom,
  type EventUpdatePinnedChatRoom,
  type EventUpdatePinnedChatRoomOrder,
  MEDIA_AVATAR_VALIDATION_OPTIONS,
  MESSAGE_STATUS_VALUE,
  PINNED_CHAT_ROOM_LIMIT,
  REQ_STATUS,
  USER_CHAT_ROOM_LIMIT,
  getRoomInterlocutorId,
  getRoomOtherUserIds,
  isAcceptedContactInteraction,
  isRoomAdmin,
  isRoomGroup,
  isRoomPrivate
} from 'global-shared'
import intersection from 'lodash/intersection'
import union from 'lodash/union'
import without from 'lodash/without'

import { AppError } from 'src/shared/lib/app-error'
import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import { deleteBucketFileById, uploadBufferToBucket, withUploadedMediaCleanup } from '../media/media.service'
import { MessageModel } from '../messages/messages.model'
import { transformMessageForUser } from '../messages/messages.service'
import type { MessageDocument } from '../messages/messages.types'
import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { ROOM_CREATED_EVENT_DELAY_MS } from './chat-rooms.constants'
import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import { ChatRoomModel } from './chat-rooms.model'
import type { ChatRoomDocument, ChatRoomSchema, TransformRoomForUserParams } from './chat-rooms.types'

export const checkContactsExistence = async (selfId: string, contactIds: string[]) => {
  const [self, contacts] = await Promise.all([
    UserModel.findById(selfId, { 'personal.contacts': 1 }),
    UserModel.find({ _id: { $in: contactIds } }, { 'personal.contacts': 1 })
  ])

  if (!self || contacts.length !== contactIds.length) {
    return false
  }

  const contactById = new Map(contacts.map((contact) => [stringifyMongoId(contact._id), contact]))

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

const validateUpdateChatRoomData = async (
  userId: string,
  addedUserIds: string[],
  nextMemberIds: string[],
  chatName: string
) => {
  const hasCurrentUser = nextMemberIds.includes(userId)

  if (!hasCurrentUser) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.updateChatRoomFailed)
  }

  if (!chatName) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomNameRequired)
  }

  if (nextMemberIds.length <= 1) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomMemberRequired)
  }

  if (nextMemberIds.length > CHAT_ROOM_GROUP_MEMBER_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomMemberLimitReached)
  }

  if (chatName.length > CHAT_ROOM_NAME_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomNameTooLong)
  }

  if (!addedUserIds.length) return

  const addedUsers = await UserModel.find({ _id: { $in: addedUserIds } }, { 'personal.chatRooms': 1 }).lean()
  const isLimitReached = addedUsers.some((user) => user.personal.chatRooms.length >= USER_CHAT_ROOM_LIMIT)

  if (isLimitReached) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomLimitReached)
  }
}

export const setRoomToUsers = async (roomId: string, userIds: string[]) => {
  await Promise.all(
    userIds.map(async (userId) => {
      await UserModel.updateOne({ _id: userId }, { $push: { 'personal.chatRooms': roomId } })
    })
  )
}

export const createChatRoom = async (
  userId: string,
  { memberIds, chatName, avatarFile }: EventCreateRoom,
  presenceService: PresenceService
): Promise<CreateRoomAckPayload> => {
  const otherMemberIds = getRoomOtherUserIds({ users: memberIds }, userId)
  const hasCurrentUser = memberIds.includes(userId)

  if (!hasCurrentUser || !otherMemberIds.length) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.createChatRoomFailed)
  }

  await validateCreateChatRoomLimits(memberIds, chatName)

  const usersAccepted = await checkContactsExistence(userId, otherMemberIds)

  if (!usersAccepted) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.createChatRoomFailed)
  }

  const roomData: ChatRoomSchema = {
    users: memberIds,
    adminId: userId,
    createdAt: Date.now(),
    chatKind: memberIds.length > 2 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT,
    avatarId: null,
    pinnedMessageId: null,
    messages: []
  }

  if (chatName) {
    roomData.chatName = chatName
  }

  const room = new ChatRoomModel(roomData)
  const roomId = stringifyMongoId(room._id)

  await withUploadedMediaCleanup(async (trackUploadedMedia) => {
    if (isRoomGroup(room) && avatarFile?.fileBuffer) {
      room.avatarId = await uploadBufferToBucket(avatarFile.fileBuffer, 'image', {
        compression: 'avatar',
        validation: MEDIA_AVATAR_VALIDATION_OPTIONS
      })
      trackUploadedMedia('image', room.avatarId)
    }

    await room.save()
  })
  await setRoomToUsers(roomId, memberIds)
  await emitNewRoomToUsers(memberIds, room.toObject(), presenceService)
  await delay(ROOM_CREATED_EVENT_DELAY_MS)

  return { roomId }
}

const countUnreadRoomMessages = async (userId: string, messageIds: string[]) => {
  if (!messageIds.length) return 0

  return MessageModel.countDocuments({
    _id: { $in: messageIds },
    authorId: { $ne: userId },
    deletedForUserIds: { $ne: userId },
    usersMetaData: {
      $elemMatch: {
        id: userId,
        status: MESSAGE_STATUS_VALUE.DELIVERED
      }
    }
  })
}

const resolveVisibleMessageIds = async (userId: string, messageIds: string[]) => {
  if (!messageIds.length) return []

  const visibleMessages = await MessageModel.find({
    _id: { $in: messageIds },
    deletedForUserIds: { $ne: userId }
  })
    .select('_id')
    .lean<Array<{ _id: string }>>()
  const visibleMessageIds = new Set(visibleMessages.map(({ _id }) => stringifyMongoId(_id)))

  return messageIds.filter((id) => visibleMessageIds.has(id))
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
    UserModel.find(
      { _id: { $in: userIds } },
      { 'public.avatarId': 1, 'public.nickname': 1, 'public.lastSeen': 1 }
    ).lean(),
    presenceService.onlineMapByUserIds(userIds)
  ])
  const userById = new Map(users.map((user) => [stringifyMongoId(user._id), user]))

  const knownUsers = userIds.map((id) => {
    const user = userById.get(id)

    if (!user) return null

    return {
      avatarId: user.public.avatarId,
      id,
      nickname: user.public.nickname,
      online: onlineMap.get(id) ?? false,
      lastSeen: user.public.lastSeen
    } satisfies KnownUser
  })

  return knownUsers.filter((user): user is KnownUser => Boolean(user))
}

const emitKnownUsersToUser = async (userId: string, roomUserIds: string[], presenceService: PresenceService) => {
  const otherUserIds = getRoomOtherUserIds({ users: roomUserIds }, userId)
  const knownUsers = await resolveKnownUsers(otherUserIds, presenceService)

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

export const updateChatRoom = async (
  userId: string,
  { roomId, memberIds, chatName, avatarFile }: EventUpdateChatRoom,
  presenceService: PresenceService
) => {
  const room = await ChatRoomModel.findOne({
    _id: roomId,
    adminId: userId,
    chatKind: CHAT_KIND.GROUP
  })
    .select('-__v')
    .lean<ChatRoomDocument>()

  if (!room) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.updateChatRoomFailed)
  }

  const currentMemberIds = stringifyMongoIds(room.users)
  const nextChatName = chatName.trim()
  const addedUserIds = memberIds.filter((id) => !currentMemberIds.includes(id))
  const removedUserIds = currentMemberIds.filter((id) => !memberIds.includes(id))
  const affectedMemberIds = union(currentMemberIds, memberIds)
  const usersAccepted = await checkContactsExistence(userId, addedUserIds)
  const currentAvatarId = room.avatarId
  let nextAvatarId = currentAvatarId

  if (!usersAccepted) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.updateChatRoomFailed)
  }

  await validateUpdateChatRoomData(userId, addedUserIds, memberIds, nextChatName)

  if (avatarFile === null) {
    nextAvatarId = null
  }

  const updatedRoom = await withUploadedMediaCleanup(async (trackUploadedMedia) => {
    if (avatarFile?.fileBuffer) {
      nextAvatarId = await uploadBufferToBucket(avatarFile.fileBuffer, 'image', {
        compression: 'avatar',
        validation: MEDIA_AVATAR_VALIDATION_OPTIONS
      })
      trackUploadedMedia('image', nextAvatarId)
    }

    return ChatRoomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $set: {
          avatarId: nextAvatarId,
          chatName: nextChatName,
          users: memberIds
        }
      },
      { new: true }
    )
      .select('-__v')
      .lean<ChatRoomDocument>()
  })
  const deletedAvatarId = currentAvatarId && currentAvatarId !== nextAvatarId ? currentAvatarId : null

  await Promise.all([
    UserModel.updateMany({ _id: { $in: addedUserIds } }, { $push: { 'personal.chatRooms': roomId } }),
    UserModel.updateMany(
      { _id: { $in: removedUserIds } },
      {
        $pull: {
          'personal.chatRooms': roomId,
          'personal.pinnedChatRoomIds': roomId,
          'personal.mutedChatRoomIds': roomId
        }
      }
    )
  ])

  if (removedUserIds.length) {
    emitToUsers(removedUserIds, 'chat-room-left', { roomId })
  }

  if (updatedRoom) {
    await emitRoomDataToUsers(memberIds, updatedRoom, presenceService)
  }

  if (deletedAvatarId) {
    await deleteBucketFileById('image', deletedAvatarId)
    emitToUsers(affectedMemberIds, 'media-files-deleted', { mediaIds: [deletedAvatarId] })
  }
}

export const deleteChatRoom = async (userId: string, { roomId }: EventDeleteChatRoom) => {
  const room = await ChatRoomModel.findOne({
    _id: roomId,
    users: userId
  })
    .select('adminId avatarId chatKind users messages')
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
  const userIds = stringifyMongoIds(users)
  const messageIds = stringifyMongoIds(messages)
  const deletedAvatarId = isGroupChatRoom ? room.avatarId : null
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

  if (deletedAvatarId) {
    deleteChatRoomTasks.push(deleteBucketFileById('image', deletedAvatarId))
  }

  await Promise.all(deleteChatRoomTasks)

  const payload: EventChatRoomDeleted = {
    roomId
  }

  emitToUsers(userIds, 'chat-room-deleted', payload)

  if (deletedAvatarId) {
    emitToUsers(userIds, 'media-files-deleted', { mediaIds: [deletedAvatarId] })
  }
}

export const transformRoomForUser = async ({
  userId,
  room,
  pinnedChatRoomIds,
  mutedChatRoomIds
}: TransformRoomForUserParams): Promise<EventGetRoom> => {
  const normalizedRoom = room
  const {
    _id,
    adminId,
    avatarId: roomAvatarId,
    chatKind: roomChatKind,
    chatName,
    createdAt,
    messages,
    pinnedMessageId: roomPinnedMessageId,
    users: roomUsers
  } = normalizedRoom
  const roomId = stringifyMongoId(_id)
  const users = stringifyMongoIds(roomUsers)
  const chatKind = roomChatKind ?? (roomUsers.length > 2 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT)
  const isDirectRoom = isRoomPrivate({ chatKind })
  const interlocutorId = isDirectRoom ? getRoomInterlocutorId({ users }, userId) : ''
  const interlocutor = isDirectRoom ? await UserModel.findById(interlocutorId, { 'public.avatarId': 1 }).lean() : null
  const avatarId = isDirectRoom ? interlocutor?.public.avatarId ?? null : roomAvatarId
  const visibleMessageIds = await resolveVisibleMessageIds(userId, messages)
  const lastMessageId = visibleMessageIds[visibleMessageIds.length - 1] ?? null
  const pinnedMessageId =
    roomPinnedMessageId && visibleMessageIds.includes(roomPinnedMessageId) ? roomPinnedMessageId : null
  const pinnedOrder = pinnedChatRoomIds.indexOf(roomId)
  const [unreadMessagesQuantity, previewMessage, pinnedMessage] = await Promise.all([
    countUnreadRoomMessages(userId, visibleMessageIds),
    lastMessageId ? MessageModel.findById(lastMessageId).select('-__v').lean<MessageDocument>() : null,
    pinnedMessageId ? MessageModel.findById(pinnedMessageId).select('-__v').lean<MessageDocument>() : null
  ])

  return {
    id: roomId,
    adminId,
    createdAt,
    chatName,
    chatKind,
    avatarId,
    lastMessageId,
    pinnedMessageId,
    unreadMessagesQuantity,
    isPinned: pinnedOrder !== -1,
    pinnedOrder: pinnedOrder === -1 ? null : pinnedOrder,
    isMuted: mutedChatRoomIds.includes(roomId),
    users,
    messages: visibleMessageIds,
    previewMessage: previewMessage ? transformMessageForUser(previewMessage, userId) : null,
    pinnedMessage: pinnedMessage ? transformMessageForUser(pinnedMessage, userId) : null
  } satisfies EventGetRoom
}

const emitRoomToUsers = async (
  userIds: string[],
  room: ChatRoomDocument,
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
  room: ChatRoomDocument,
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
    .lean<ChatRoomDocument>()

  if (!room) {
    return
  }

  const { users, adminId } = room
  const userIds = stringifyMongoIds(users)
  const remainingUserIds = getRoomOtherUserIds({ users: userIds }, userId)
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
      .lean<ChatRoomDocument>(),
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

export const emitNewRoomToUsers = async (
  userIds: string[],
  room: ChatRoomDocument,
  presenceService: PresenceService
) => {
  await emitRoomToUsers(userIds, room, presenceService, 'new-room-added')
}
