import { io } from './../../server'
import { SocketActions } from './../../../../types'
import getRoomsByHasContact from './getRoomsByHasContact'
import getSocketsByUsersArray from './getSocketsByUsersArray'
import getUsersByHasContactId from './getUsersByHasContactId'
const ObjectIdType = require('mongoose').Types.ObjectId

export const emitUserStatusToAll = async (userId: string | typeof ObjectIdType, status: boolean) => {
  const roomsByHasContact = await getRoomsByHasContact(userId)
  const usersByHasContactId = await getUsersByHasContactId(userId)

  const usersIdsFromRoom = roomsByHasContact.map((room) => room.users.map((user) => user.id)).flat(Infinity)
  const usersIdsFromUsers = usersByHasContactId.map((user) => user.id)
  const users = [...usersIdsFromRoom, ...usersIdsFromUsers]
  const sockets = await getSocketsByUsersArray(users)

  sockets.forEach((socketId: string) => {
    io.to(socketId).emit(SocketActions.STATUS_CONTACT, { userId, status })
  })
}

export default emitUserStatusToAll
