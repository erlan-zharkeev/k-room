import { getRoomOtherUserIds, type Contact, type EventGetContacts, type EventGetRooms } from 'global-shared'
import uniq from 'lodash/uniq'

import { ChatRoomModel } from '../../chat-rooms/chat-rooms.model'
import { resolveKnownUsers, transformRoomForUser } from '../../chat-rooms/chat-rooms.service'
import type { PresenceService } from '../../presence/presence.service'
import { UserModel } from '../user.model'

import { transformUserToFrontendContact } from './transform-user'

export const resolveActualUserSocketData = async (userId: string, presenceService: PresenceService) => {
  const data = await UserModel.findById(userId).lean()

  if (!data) {
    return null
  }

  const { contacts, chatRooms: roomIds, pinnedChatRoomIds, mutedChatRoomIds } = data.personal
  const contactResultData: Contact[] = await transformUserToFrontendContact(contacts, presenceService)
  const rooms = await ChatRoomModel.find({ _id: { $in: roomIds } }).lean()
  const knownUserIds = uniq(rooms.flatMap((room) => getRoomOtherUserIds(room, userId)))
  const knownUsers = await resolveKnownUsers(knownUserIds, presenceService)
  const contactsPayload: EventGetContacts = {
    contacts: contactResultData,
    knownUsers
  }
  const roomsPayload: EventGetRooms = await Promise.all(
    rooms.map((room) => transformRoomForUser({ userId, room, pinnedChatRoomIds, mutedChatRoomIds }))
  )

  return {
    contactsPayload,
    roomsPayload
  }
}
