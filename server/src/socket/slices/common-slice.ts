import { UserModel } from '../../models'
import { io } from '../../server'
import { SocketInstanceType, SocketActions, SocketActionsPayload } from '../../@types'
import { setSocketId, emitContactsToUser, emitRoomsByUserId, setUserStatus, setLastSeenData } from '../helpers'
import { emitCallsToUser } from '../helpers/emitters/emit-call-to-users'

export const commonSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on(SocketActions.INITIALIZE, async () => {
    io.to(socket.id).emit(SocketActions.CONNECTION)
    await setSocketId(userId, socket.id)
    await emitContactsToUser(userId)
    await emitRoomsByUserId(userId)
    await emitCallsToUser(userId)
    await setUserStatus(userId, true)
  })
  socket.on(SocketActions.DISCONNECT, async () => {
    await setUserStatus(userId, false)
    setLastSeenData(userId)
  })

  socket.on(SocketActions.UPDATE_USER_SETTINGS, async ({ type, value }: SocketActionsPayload['updateUserSettings']) => {
    const query: Record<string, string | boolean> = {}
    query['settings.' + type] = value
    const response = await UserModel.findOneAndUpdate({ _id: userId }, query, { new: true })
  })
}
