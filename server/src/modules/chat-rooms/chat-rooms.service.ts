import { setTimeout as delay } from 'timers/promises'

import {
  CHAT_KIND,
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
  PINNED_CHAT_ROOM_LIMIT,
  REQ_STATUS,
  getRoomInterlocutorId,
  getRoomOtherUserIds,
  isRoomAdmin,
  isRoomGroup,
  isRoomPrivate
} from 'global-shared'
import union from 'lodash/union'

import { AppError } from 'src/shared/lib/app-error'
import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import { deleteBucketFileById, uploadBufferToBucket, withUploadedMediaCleanup } from '../media/media.service'
import { countUnreadMessagesByIds, deleteMessagesByIds, loadMessageById } from '../messages/lib/message-persistence'
import { resolveVisibleMessageIds } from '../messages/lib/resolve-visible-message-ids'
import { transformMessageForUser } from '../messages/messages.service'
import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'
import {
  addChatRoomToUsers,
  addChatRoomToUsersByIds,
  checkUsersAcceptedContacts,
  loadUserMutedChatRoomsForRoom,
  loadUserPinnedChatRooms,
  loadUserPinnedChatRoomsForRoom,
  loadUserPublicById,
  loadUserRoomPreferences,
  loadUsersPublicByIds,
  removeChatRoomFromUser,
  removeChatRoomFromUsersByIds,
  setUserMutedChatRoomIds,
  setUserPinnedChatRoomIds
} from '../user/lib/user-persistence'

import { ROOM_CREATED_EVENT_DELAY_MS } from './chat-rooms.constants'
import { CHAT_ROOMS_I18N } from './chat-rooms.i18n'
import { ChatRoomModel } from './chat-rooms.model'
import type {
  ChatRoomDeleteProjection,
  ChatRoomDocument,
  ChatRoomSchema,
  TransformRoomForUserParams
} from './chat-rooms.types'
import { assertCreateChatRoomLimits, assertUpdateChatRoomData } from './lib/assert-chat-room-limits'
import { resolveChatRoomMemberIds } from './lib/resolve-chat-room-member-ids'
import { resolvePinnedChatRoomOrder, resolveToggledRoomIds } from './lib/resolve-toggled-room-ids'

export const createChatRoom = async (
  userId: string,
  { memberIds, chatName, avatarFile }: EventCreateRoom,
  presenceService: PresenceService
): Promise<CreateRoomAckPayload> => {
  const roomMemberIds = resolveChatRoomMemberIds(userId, memberIds)
  const otherMemberIds = getRoomOtherUserIds({ users: roomMemberIds }, userId)

  if (!otherMemberIds.length) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.createChatRoomFailed)
  }

  await assertCreateChatRoomLimits(roomMemberIds, chatName)

  const usersAccepted = await checkUsersAcceptedContacts(userId, otherMemberIds)

  if (!usersAccepted) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.createChatRoomFailed)
  }

  const roomData: ChatRoomSchema = {
    users: roomMemberIds,
    adminId: userId,
    createdAt: Date.now(),
    chatKind: roomMemberIds.length > 2 ? CHAT_KIND.GROUP : CHAT_KIND.DIRECT,
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
  await addChatRoomToUsers(roomId, roomMemberIds)
  await emitNewRoomToUsers(roomMemberIds, room.toObject(), presenceService)
  await delay(ROOM_CREATED_EVENT_DELAY_MS)

  return { roomId }
}

export const resolveKnownUsers = async (userIds: string[], presenceService: PresenceService): Promise<KnownUser[]> => {
  if (!userIds.length) return []

  const [users, onlineMap] = await Promise.all([
    loadUsersPublicByIds(userIds),
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
  const user = await loadUserPinnedChatRoomsForRoom(userId, roomId)

  if (!user) {
    return
  }

  const currentPinnedChatRoomIds = user.personal.pinnedChatRoomIds
  const isAlreadyPinned = currentPinnedChatRoomIds.includes(roomId)

  if (isPinned && !isAlreadyPinned && currentPinnedChatRoomIds.length >= PINNED_CHAT_ROOM_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.pinnedChatRoomLimitReached)
  }

  const pinnedChatRoomIds = resolveToggledRoomIds(currentPinnedChatRoomIds, roomId, isPinned)

  await setUserPinnedChatRoomIds(userId, pinnedChatRoomIds)

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

  const user = await loadUserPinnedChatRooms(userId)

  if (!user) {
    return
  }

  const nextPinnedChatRoomIds = resolvePinnedChatRoomOrder(user.personal.pinnedChatRoomIds, pinnedChatRoomIds)

  await setUserPinnedChatRoomIds(userId, nextPinnedChatRoomIds)

  emitToUsers([userId], 'pinned-chat-rooms-updated', {
    pinnedChatRoomIds: nextPinnedChatRoomIds
  })
}

export const updateMutedChatRoom = async (userId: string, { roomId, isMuted }: EventUpdateMutedChatRoom) => {
  const user = await loadUserMutedChatRoomsForRoom(userId, roomId)

  if (!user) {
    return
  }

  const currentMutedChatRoomIds = user.personal.mutedChatRoomIds
  const mutedChatRoomIds = resolveToggledRoomIds(currentMutedChatRoomIds, roomId, isMuted)

  await setUserMutedChatRoomIds(userId, mutedChatRoomIds)

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
  const nextMemberIds = resolveChatRoomMemberIds(userId, memberIds)
  const nextChatName = chatName.trim()
  const addedUserIds = nextMemberIds.filter((id) => !currentMemberIds.includes(id))
  const removedUserIds = currentMemberIds.filter((id) => !nextMemberIds.includes(id))
  const affectedMemberIds = union(currentMemberIds, nextMemberIds)
  const usersAccepted = await checkUsersAcceptedContacts(userId, addedUserIds)
  const currentAvatarId = room.avatarId
  let nextAvatarId = currentAvatarId

  if (!usersAccepted) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.updateChatRoomFailed)
  }

  await assertUpdateChatRoomData(userId, addedUserIds, nextMemberIds, nextChatName)

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
          users: nextMemberIds
        }
      },
      { new: true }
    )
      .select('-__v')
      .lean<ChatRoomDocument>()
  })
  const deletedAvatarId = currentAvatarId && currentAvatarId !== nextAvatarId ? currentAvatarId : null

  await Promise.all([
    addChatRoomToUsersByIds(roomId, addedUserIds),
    removeChatRoomFromUsersByIds(roomId, removedUserIds)
  ])

  if (removedUserIds.length) {
    emitToUsers(removedUserIds, 'chat-room-left', { roomId })
  }

  if (updatedRoom) {
    await emitRoomDataToUsers(nextMemberIds, updatedRoom, presenceService)
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
    .lean<ChatRoomDeleteProjection>()

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
    deleteMessagesByIds(messageIds),
    removeChatRoomFromUsersByIds(roomId, userIds).exec()
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
  const interlocutor = isDirectRoom ? await loadUserPublicById(interlocutorId) : null
  const avatarId = isDirectRoom ? interlocutor?.public.avatarId ?? null : roomAvatarId
  const visibleMessageIds = await resolveVisibleMessageIds(userId, messages)
  const lastMessageId = visibleMessageIds[visibleMessageIds.length - 1] ?? null
  const pinnedMessageId =
    roomPinnedMessageId && visibleMessageIds.includes(roomPinnedMessageId) ? roomPinnedMessageId : null
  const pinnedOrder = pinnedChatRoomIds.indexOf(roomId)
  const [unreadMessagesQuantity, previewMessage, pinnedMessage] = await Promise.all([
    countUnreadMessagesByIds(userId, visibleMessageIds),
    lastMessageId ? loadMessageById(lastMessageId) : null,
    pinnedMessageId ? loadMessageById(pinnedMessageId) : null
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
      const userData = await loadUserRoomPreferences(userId)

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
    removeChatRoomFromUser(roomId, userId)
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
