import type { ChatRoom } from '../types'

export const getRoomOtherUserIds = (room: Pick<ChatRoom, 'users'>, userId: string) =>
  room.users.filter((id) => id !== userId)

export const getRoomInterlocutorId = (room: Pick<ChatRoom, 'users'>, userId: string) =>
  getRoomOtherUserIds(room, userId)[0] as string
