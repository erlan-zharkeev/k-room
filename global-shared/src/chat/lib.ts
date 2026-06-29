import type { ChatRoom } from './types'

export const getRoomOtherUserIds = (room: Pick<ChatRoom, 'users'>, userId: string) =>
  room.users.filter((id) => id !== userId)

export const getRoomInterlocutorId = (room: Pick<ChatRoom, 'users'>, userId: string) =>
  getRoomOtherUserIds(room, userId)[0] as string

export const isRoomAdmin = (room: Pick<ChatRoom, 'adminId'>, userId: string) => room.adminId === userId

export const isRoomGroup = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === 'group'

export const isRoomFavorites = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === 'favorites'

export const isRoomPrivate = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === 'direct'

export const isRoomSupport = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === 'support'
