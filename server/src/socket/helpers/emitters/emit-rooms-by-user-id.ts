import { ChatRoomModel } from '../../../models'
import { io } from '../../../server'
import { EventGetRoomsType, IChatRoom, SocketActionsType } from '../../../@types'
import { transformRoomForUser } from '../../../utils'
import { getUserById } from '../getters'

export const emitRoomsByUserId = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData?.socketId) return
  const rooms = await ChatRoomModel.find({ _id: { $in: userData.chatRooms } })
  const transformedRooms = await Promise.all(rooms.map(async (room) => await transformRoomForUser({ userId, room })))
  const filteredRooms: EventGetRoomsType = transformedRooms.filter((room): room is IChatRoom => room !== undefined)
  io.to(userData.socketId).emit<SocketActionsType>('rooms-loaded', filteredRooms)
}
