import { CallModel } from '../../models'
import { io } from '../../server'
import { SocketInstanceType, SocketActions, SocketActionsPayload } from '../../@types'
import { emitCallDataToInterlocutors } from '../../utils'
import { getUserById } from '../helpers'

export const callSlice = (socket: SocketInstanceType) => {
  socket.on(SocketActions.MARK_CALL_AS_VIDEO, (payload: SocketActionsPayload['markCallAsVideo']) => {
    CallModel.updateOne({ _id: payload.callId }, { video: true })
  })

  socket.on(
    SocketActions.CALL_USER,
    async ({ signal, userToCall, from, avatarPath, callerName }: SocketActionsPayload['callUser']) => {
      if (!userToCall) return
      const interlocutor = await getUserById(userToCall)
      if (!interlocutor) return
      const payload: SocketActionsPayload['callUser'] = {
        signal,
        from,
        avatarPath,
        callerName
      }
      io.to(interlocutor?.socketId).emit(SocketActions.CALL_USER, payload)
      const interlocutors = [userToCall, from]
      const call = new CallModel({
        calledAt: new Date(),
        authorId: from,
        interlocutors,
        answered: false
      })
      await call.save()
      emitCallDataToInterlocutors(interlocutors, call.id, true)

      socket.on(SocketActions.UPDATE_CALL_SIGNAL, (payload: SocketActionsPayload['updateSignal']) => {
        io.to(interlocutor?.socketId).emit(SocketActions.INTERLOCUTOR_UPDATE_SIGNAL, payload)
      })
    }
  )

  socket.on(
    SocketActions.ANSWER_CALL,
    async ({ to, signal, selfSocketId, callId }: SocketActionsPayload['answerCall']) => {
      const interlocutor = await getUserById(to)
      if (!interlocutor) return
      const payload: SocketActionsPayload['callAccepted'] = {
        signal
      }
      io.to(interlocutor?.socketId).emit(SocketActions.CALL_ACCEPTED, payload)
      const call = await CallModel.findOneAndUpdate(
        { _id: callId },
        { startedAt: new Date(), answered: true },
        { new: true }
      )
      if (!call) return
      emitCallDataToInterlocutors(call?.interlocutors, call._id)

      const sockets = [interlocutor.socketId, selfSocketId]
      sockets.forEach((socketId) => {
        const payload: SocketActionsPayload['callStartedAt'] = Date.now()
        io.to(socketId).emit(SocketActions.CALL_STARTED_AT, payload)
      })
    }
  )

  socket.on(SocketActions.CALL_ENDED, async ({ callerId, callId }: SocketActionsPayload['callEnded']) => {
    const interlocutor = await getUserById(callerId)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit(SocketActions.CALL_ENDED)
    const call = await CallModel.findOneAndUpdate({ _id: callId }, { finishedAt: new Date() })
    if (!call) return
    emitCallDataToInterlocutors(call?.interlocutors, call._id)
  })
}
