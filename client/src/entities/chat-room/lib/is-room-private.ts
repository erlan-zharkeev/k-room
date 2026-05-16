import type { IChatRoom } from 'global-shared'

export const isRoomPrivate = (room: IChatRoom | undefined) => Boolean(room && room.users.length === 1)
