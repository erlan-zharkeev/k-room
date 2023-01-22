import { io } from './../../server'
import { SocketActions } from './../../../../types'
import getOnlineUsersByIdsArray from './getOnlineUsersByIdsArray'
import getUserById from './getUserById'

export const emitRoomsByUserId = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData?.socketId) return

  const rooms = await Promise.all(
    userData.chatRooms.map(async (room) => {
      const onlineUsers = await getOnlineUsersByIdsArray(room.users)
      if (onlineUsers.length > 0) room.hasOnline = true
      room.messages.forEach((message) => {
        message.isSelf = message.author === userId
      })
      return room
    })
  )
  io.to(userData.socketId).emit(SocketActions.GET_ROOMS, rooms)
}

export default emitRoomsByUserId
