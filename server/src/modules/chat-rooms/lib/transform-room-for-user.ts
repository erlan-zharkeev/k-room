import { CHAT_KIND, type EventGetRoom, getRoomInterlocutorId, isRoomPrivate } from 'global-shared'

import { countUnreadMessagesByIds, loadMessageById } from 'src/modules/messages/lib/message-persistence'
import { resolveVisibleMessageIds } from 'src/modules/messages/lib/resolve-visible-message-ids'
import { transformMessageForUser } from 'src/modules/messages/lib/transform-message-for-user'
import { loadUserPublicById } from 'src/modules/user/lib/user-persistence'
import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import type { TransformRoomForUserParams } from '../chat-rooms.types'

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
