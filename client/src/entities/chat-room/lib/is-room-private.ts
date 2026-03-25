import { IChatRoom } from 'common'

export const isRoomPrivate = (room: IChatRoom | undefined) => Boolean(room && room.users.length > 0)
