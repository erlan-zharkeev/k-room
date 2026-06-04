import { CHAT_ROOM_NAME_MAX_LENGTH, REQ_STATUS, ROOM_PARTICIPANT_LIMIT, USER_CHAT_ROOM_LIMIT } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { loadUsersChatRoomsByIds } from '../../user/lib/user-persistence'
import { CHAT_ROOMS_I18N } from '../chat-rooms.i18n'

const assertChatRoomMemberLimit = (userIds: string[]) => {
  if (userIds.length > ROOM_PARTICIPANT_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomMemberLimitReached)
  }
}

const assertChatRoomNameLimit = (chatName: string) => {
  if (chatName.length > CHAT_ROOM_NAME_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomNameTooLong)
  }
}

const assertUserChatRoomLimit = async (userIds: string[]) => {
  if (!userIds.length) return

  const users = await loadUsersChatRoomsByIds(userIds)
  const isLimitReached = users.some((user) => user.personal.chatRooms.length >= USER_CHAT_ROOM_LIMIT)

  if (isLimitReached) {
    throw new AppError(REQ_STATUS.badRequest, CHAT_ROOMS_I18N.chatRoomLimitReached)
  }
}

export const assertCreateChatRoomLimits = async (userIds: string[], chatName?: string) => {
  await assertUserChatRoomLimit(userIds)
  assertChatRoomMemberLimit(userIds)

  if (chatName) {
    assertChatRoomNameLimit(chatName)
  }
}

export const assertUpdateChatRoomData = async (
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

  assertChatRoomMemberLimit(nextMemberIds)
  assertChatRoomNameLimit(chatName)
  await assertUserChatRoomLimit(addedUserIds)
}
