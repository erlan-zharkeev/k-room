import { io } from '../../app/server'
import type { SocketInstanceType } from 'shared/types'
import type { SocketActionsType } from 'common-types'
import { setSocketId, emitContactsToUser, emitRoomsByUserId, setUserStatus, setLastSeenData } from '../helpers'
import { emitCallsToUser } from '../helpers/emitters/emit-call-to-users'

export const commonSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on<SocketActionsType>('initialize', async () => {
    io.to(socket.id).emit<SocketActionsType>('connection')
    await setSocketId(userId, socket.id)
    await emitContactsToUser(userId)
    await emitRoomsByUserId(userId)
    await emitCallsToUser(userId)
    await setUserStatus(userId, true)
  })
  socket.on<SocketActionsType>('disconnect', async () => {
    await setUserStatus(userId, false)
    setLastSeenData(userId)
  })
}
