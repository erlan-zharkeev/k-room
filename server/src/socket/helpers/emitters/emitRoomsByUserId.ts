import { io } from '../../../server'
import { DBChatRoom, SocketActions } from '../../../../../types'
import { getUserById } from '../getters/getUserById'
import { ChatRoomModel } from '../../../models/chatRoom.model'
import { transformRoomForUser } from '../../../utils/transdusers/transformRoomForUser'

export const emitRoomsByUserId = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData?.socketId) return
  const rooms: Array<DBChatRoom> = await ChatRoomModel.find({ _id: { $in: userData.chatRooms } })
  const transformedRooms = await Promise.all(rooms.map(async (room) => await transformRoomForUser({ userId, room })))
  io.to(userData.socketId).emit(SocketActions['get-rooms'], transformedRooms)
}

export default emitRoomsByUserId
