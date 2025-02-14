import { UserModel } from '../../models'
import { io } from '../../server'
import { SocketInstanceType, SocketActions, EventUpdateUserSettings } from '../../@types'
import { setSocketId, emitContactsToUser, emitRoomsByUserId, setUserStatus, setLastSeenData } from '../helpers'
import { emitCallsToUser } from '../helpers/emitters/emit-call-to-users'

export const commonSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on<SocketActions>('initialize', async () => {
    io.to(socket.id).emit<SocketActions>('connection')
    await setSocketId(userId, socket.id)
    await emitContactsToUser(userId)
    await emitRoomsByUserId(userId)
    await emitCallsToUser(userId)
    await setUserStatus(userId, true)
  })
  socket.on<SocketActions>('disconnect', async () => {
    await setUserStatus(userId, false)
    setLastSeenData(userId)
  })

  socket.on<SocketActions>('update-user-settings', async ({ type, value }: EventUpdateUserSettings) => {
    const query: Record<string, string | boolean> = {}
    query['settings.' + type] = value
    await UserModel.findOneAndUpdate({ _id: userId }, query, { new: true })
  })
}
