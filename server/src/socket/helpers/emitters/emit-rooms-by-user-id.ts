import { ChatRoomModel } from '../../../models'
import { io } from '../../../server'
import { EventGetRooms, SocketActions } from '../../../@types'
import { transformRoomForUser } from '../../../utils'
import { getUserById } from '../getters'

export const emitRoomsByUserId = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData?.socketId) return
  const rooms = await ChatRoomModel.find({ _id: { $in: userData.chatRooms } })
  const transformedRooms: EventGetRooms = await Promise.all(
    rooms.map(async (room) => await transformRoomForUser({ userId, room }))
  )
  io.to(userData.socketId).emit<SocketActions>('get-rooms', transformedRooms)
}
