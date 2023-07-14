import { SocketActions, SocketActionsPayload } from '../../../../types'
import { CallModel } from '../../models/call.model'
import { io } from '../../server'
import { SocketInstanceType } from '../../types/SocketInstanceType'
import { emitCallsDataToInterlocutors } from '../../utils/emitRoomsToInterlocutors'
import { getUserById } from '../helpers/getters/getUserById'

export const callSlice = (socket: SocketInstanceType) => {
  socket.on(
    SocketActions.CALL_USER,
    async ({ signal, userToCall, from, avatarPath, callerName, settings }: SocketActionsPayload['callUser']) => {
      if (!userToCall) return
      const interlocutor = await getUserById(userToCall)
      if (!interlocutor) return
      const payload: SocketActionsPayload['callUser'] = {
        signal,
        from,
        avatarPath,
        callerName,
        settings
      }
      io.to(interlocutor?.socketId).emit(SocketActions.CALL_USER, payload)

      socket.on(SocketActions.CHANGE_CALL_SETTINGS, (data: SocketActionsPayload['changeCallSettings']) => {
        io.to(interlocutor?.socketId).emit(SocketActions.CHANGE_CALL_SETTINGS, data)
      })

      const interlocutors = [userToCall, from]
      const call = new CallModel({
        calledAt: new Date(),
        authorId: from,
        interlocutors,
        answered: false,
        video: settings.video
      })
      await call.save()
      // emitCallsDataToInterlocutors(call?.interlocutors, call._id)
      // interlocutors.forEach((interlocutorId) => {
      //   // const UserModel.
      // })
      // io.to()
      // io.to()
    }
  )

  socket.on(
    SocketActions.ANSWER_CALL,
    async ({ to, signal, settings, selfSocketId, callId }: SocketActionsPayload['answerCall']) => {
      const interlocutor = await getUserById(to)
      if (!interlocutor) return
      const payload: SocketActionsPayload['callAccepted'] = {
        signal,
        settings
      }
      io.to(interlocutor?.socketId).emit(SocketActions.CALL_ACCEPTED, payload)
      const call = await CallModel.findOneAndUpdate(
        { _id: callId },
        { startedAt: new Date(), answered: true },
        { new: true }
      )
      if (!call) return
      emitCallsDataToInterlocutors(call?.interlocutors, call._id)

      const sockets = [interlocutor.socketId, selfSocketId]
      sockets.forEach((socketId) => {
        const payload: SocketActionsPayload['callStartedAt'] = Date.now()
        io.to(socketId).emit(SocketActions.CALL_STARTED_AT, payload)
      })
      socket.on(SocketActions.CHANGE_CALL_SETTINGS, (data: SocketActionsPayload['changeCallSettings']) => {
        io.to(interlocutor?.socketId).emit(SocketActions.CHANGE_CALL_SETTINGS, data)
      })
    }
  )

  socket.on(SocketActions.CALL_ENDED, async ({ callerId, callId }: SocketActionsPayload['callEnded']) => {
    const interlocutor = await getUserById(callerId)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit(SocketActions.CALL_ENDED)
    const call = await CallModel.findOneAndUpdate({ _id: callId }, { finishedAt: new Date() })
    if (!call) return
    emitCallsDataToInterlocutors(call?.interlocutors, call._id)
  })
}
