import { IChatRoom } from 'common-types'

export const isRoomPrivate = (room: IChatRoom | undefined) => Boolean(room && room.users.length > 0)
