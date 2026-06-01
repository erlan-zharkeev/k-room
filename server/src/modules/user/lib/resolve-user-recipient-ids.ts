import { getRoomOtherUserIds } from 'global-shared'
import uniq from 'lodash/uniq'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { loadChatRoomUsersByUserId } from '../../chat-rooms/lib/chat-room-persistence'

import { loadUsersHavingContact } from './user-persistence'

export const resolveUserRelatedRecipientIds = async (userId: string) => {
  const [contacts, rooms] = await Promise.all([
    loadUsersHavingContact(userId),
    loadChatRoomUsersByUserId(userId)
  ])

  return uniq([
    ...contacts.map((contact) => stringifyMongoId(contact._id)),
    ...rooms.flatMap((room) => getRoomOtherUserIds(room, userId))
  ])
}
