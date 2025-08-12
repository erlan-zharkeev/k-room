import { CallModel } from '../../models'
import { io } from '../../app/server'
import type {
  SocketActionsType,
  IEventMarkCallAsVideo,
  IEventCallUser,
  IEventUpdateSignal,
  IEventAnswerCall,
  IEventCallAccepted,
  EventCallStartedAtType,
  IEventCallEnded
} from 'common-types'
import type { SocketInstanceType } from 'shared/types'

import { emitCallDataToInterlocutors, getUserById } from '../helpers'

export const callSlice = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('mark-call-as-video', (payload: IEventMarkCallAsVideo) => {
    CallModel.updateOne({ _id: payload.callId }, { video: true })
  })

  socket.on<SocketActionsType>(
    'call-user',
    async ({ signal, userToCall, from, avatar, callerName }: IEventCallUser) => {
      if (!userToCall) return
      const interlocutor = await getUserById(userToCall)
      if (!interlocutor) return
      const payload: IEventCallUser = {
        signal,
        from,
        avatar,
        callerName
      }
      io.to(interlocutor?.socketId).emit<SocketActionsType>('call-user', payload)
      const interlocutors = [userToCall, from]
      const call = new CallModel({
        calledAt: new Date(),
        authorId: from,
        interlocutors,
        answered: false
      })
      await call.save()
      emitCallDataToInterlocutors(interlocutors, call.id, true)

      socket.on<SocketActionsType>('update-call-signal', (payload: IEventUpdateSignal) => {
        io.to(interlocutor?.socketId).emit<SocketActionsType>('interlocutor-update-signal', payload)
      })
    }
  )

  socket.on<SocketActionsType>('answer-call', async ({ to, signal, selfSocketId, callId }: IEventAnswerCall) => {
    const interlocutor = await getUserById(to)
    if (!interlocutor) return
    const payload: IEventCallAccepted = {
      signal
    }
    io.to(interlocutor?.socketId).emit<SocketActionsType>('call-accepted', payload)
    const call = await CallModel.findOneAndUpdate(
      { _id: callId },
      { startedAt: new Date(), answered: true },
      { new: true }
    )
    if (!call) return
    emitCallDataToInterlocutors(call?.interlocutors, call._id)

    const sockets = [interlocutor.socketId, selfSocketId]
    sockets.forEach((socketId) => {
      const payload: EventCallStartedAtType = Date.now()
      io.to(socketId).emit<SocketActionsType>('call-started-at', payload)
    })
  })

  socket.on<SocketActionsType>('call-ended', async ({ callerId, callId }: IEventCallEnded) => {
    const interlocutor = await getUserById(callerId)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit<SocketActionsType>('call-ended')
    const call = await CallModel.findOneAndUpdate({ _id: callId }, { finishedAt: new Date() })
    if (!call) return
    emitCallDataToInterlocutors(call?.interlocutors, call._id)
  })
}
