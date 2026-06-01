import { formatNickname, getRoomOtherUserIds, isRoomPrivate, type ChatRoom } from 'global-shared'

import type { ContactRecord, KnownUserRecord } from 'src/shared/lib'

export const resolveRoomCallNotificationContent = (
  room: ChatRoom,
  currentUserId: string,
  contactById: Map<string | number, ContactRecord>,
  knownUserById: Map<string | number, KnownUserRecord>,
  privateRoomCallText: string,
  groupRoomCallText: string
) => {
  if (room.chatName) return room.chatName
  if (!isRoomPrivate(room)) return groupRoomCallText

  const [interlocutorId] = getRoomOtherUserIds(room, currentUserId)
  const interlocutor = contactById.get(interlocutorId) ?? knownUserById.get(interlocutorId)

  if (!interlocutor) return privateRoomCallText

  return formatNickname(interlocutor.nickname)
}
