import { SocketActions, SocketActionsPayload } from '../../../../types'
import { UserModel } from '../../models/user.model'
import { io } from '../../server'
import { SocketInstanceType } from '../../types/SocketInstanceType'
import { emitContactsToUser, emitRoomsByUserId } from '../helpers/emitters'
import emitCallsToUser from '../helpers/emitters/emitCallToUsers'
import { getUserBySocketId } from '../helpers/getters/getUserBySocketId'
import { setSocketId, setUserStatus, setLastSeenData } from '../helpers/setters'

export const commonSlice = (socket: SocketInstanceType) => {
  socket.on(SocketActions.INITIALIZE, async ({ userId }: SocketActionsPayload['initialize']) => {
    io.to(socket.id).emit(SocketActions.CONNECTION)
    await setSocketId(userId, socket.id)
    await emitContactsToUser(userId)
    await emitRoomsByUserId(userId)
    await emitCallsToUser(userId)
    await setUserStatus(userId, true)
  })

  socket.on(SocketActions.DISCONNECT, async () => {
    const userData = await getUserBySocketId(socket.id)
    if (!userData) return
    const id = userData._id
    await setUserStatus(id, false)
    await setLastSeenData(id)
  })

  socket.on(
    SocketActions.UPDATE_USER_SETTINGS,
    async ({ userId, type, value }: SocketActionsPayload['updateUserSettings']) => {
      const query: Record<string, string | boolean> = {}
      query['settings.' + type] = value
      await UserModel.findOneAndUpdate({ _id: userId }, query, { new: true })
    }
  )
}
