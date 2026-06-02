import { getRoomOtherUserIds, isRoomPrivate } from 'global-shared'

import { stringifyMongoId, stringifyMongoIds } from 'src/shared/lib/normalize-object-id'

import { loadChatRoomsByIds } from '../../chat-rooms/lib/chat-room-persistence'
import { loadUsersPublicByIds } from '../../user/lib/user-persistence'

const isRoomCallSearchTitleMatched = (title: string, normalizedQuery: string) =>
  title.toLowerCase().includes(normalizedQuery)

export const resolveUserRoomCallSearchRoomIds = async (userId: string, roomIds: string[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return roomIds

  const rooms = await loadChatRoomsByIds(roomIds)
  const privateInterlocutorIds = rooms.flatMap((room) => {
    const users = stringifyMongoIds(room.users)

    return isRoomPrivate(room) ? getRoomOtherUserIds({ users }, userId) : []
  })
  const privateInterlocutors = await loadUsersPublicByIds(privateInterlocutorIds)
  const privateInterlocutorById = new Map(
    privateInterlocutors.map((interlocutor) => [stringifyMongoId(interlocutor._id), interlocutor])
  )

  return rooms.flatMap((room) => {
    const { chatName } = room
    const roomId = stringifyMongoId(room._id)

    if (chatName && isRoomCallSearchTitleMatched(chatName, normalizedQuery)) return [roomId]
    if (!isRoomPrivate(room)) return []

    const users = stringifyMongoIds(room.users)
    const [interlocutorId] = getRoomOtherUserIds({ users }, userId)
    const interlocutor = privateInterlocutorById.get(interlocutorId)

    if (!interlocutor) return []

    return isRoomCallSearchTitleMatched(interlocutor.public.nickname, normalizedQuery) ? [roomId] : []
  })
}
