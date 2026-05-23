import type { ChatRoom } from '../types'

export const isRoomAdmin = (room: Pick<ChatRoom, 'adminId'>, userId: string) => room.adminId === userId
