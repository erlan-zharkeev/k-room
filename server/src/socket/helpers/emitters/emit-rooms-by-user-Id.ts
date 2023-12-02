import { ChatRoomModel } from '../../../models'
import { io } from '../../../server'
import { DBChatRoom, SocketActionsPayload, SocketActions } from '../../../@types'
import { transformRoomForUser } from '../../../utils'
import { getUserById } from '../getters'

export const emitRoomsByUserId = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData?.socketId) return
  const rooms: Array<DBChatRoom> = await ChatRoomModel.find({ _id: { $in: userData.chatRooms } })
  const transformedRooms: SocketActionsPayload['getRooms'] = await Promise.all(
    rooms.map(async (room) => await transformRoomForUser({ userId, room }))
  )
  io.to(userData.socketId).emit(SocketActions.GET_ROOMS, transformedRooms)
}
