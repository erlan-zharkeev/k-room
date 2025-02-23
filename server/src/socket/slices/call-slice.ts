import { CallModel } from '../../models'
import { io } from '../../server'
import {
  SocketInstanceType,
  SocketActions,
  EventMarkCallAsVideo,
  EventCallUser,
  EventUpdateSignal,
  EventAnswerCall,
  EventCallAccepted,
  EventCallStartedAt,
  EventCallEnded
} from '../../@types'
import { emitCallDataToInterlocutors, getUserById } from '../helpers'

export const callSlice = (socket: SocketInstanceType) => {
  socket.on<SocketActions>('mark-call-as-video', (payload: EventMarkCallAsVideo) => {
    CallModel.updateOne({ _id: payload.callId }, { video: true })
  })

  socket.on<SocketActions>('call-user', async ({ signal, userToCall, from, avatarPath, callerName }: EventCallUser) => {
    if (!userToCall) return
    const interlocutor = await getUserById(userToCall)
    if (!interlocutor) return
    const payload: EventCallUser = {
      signal,
      from,
      avatarPath,
      callerName
    }
    io.to(interlocutor?.socketId).emit<SocketActions>('call-user', payload)
    const interlocutors = [userToCall, from]
    const call = new CallModel({
      calledAt: new Date(),
      authorId: from,
      interlocutors,
      answered: false
    })
    await call.save()
    emitCallDataToInterlocutors(interlocutors, call.id, true)

    socket.on<SocketActions>('update-call-signal', (payload: EventUpdateSignal) => {
      io.to(interlocutor?.socketId).emit<SocketActions>('interlocutor-update-signal', payload)
    })
  })

  socket.on<SocketActions>('answer-call', async ({ to, signal, selfSocketId, callId }: EventAnswerCall) => {
    const interlocutor = await getUserById(to)
    if (!interlocutor) return
    const payload: EventCallAccepted = {
      signal
    }
    io.to(interlocutor?.socketId).emit<SocketActions>('call-accepted', payload)
    const call = await CallModel.findOneAndUpdate(
      { _id: callId },
      { startedAt: new Date(), answered: true },
      { new: true }
    )
    if (!call) return
    emitCallDataToInterlocutors(call?.interlocutors, call._id)

    const sockets = [interlocutor.socketId, selfSocketId]
    sockets.forEach((socketId) => {
      const payload: EventCallStartedAt = Date.now()
      io.to(socketId).emit<SocketActions>('call-started-at', payload)
    })
  })

  socket.on<SocketActions>('call-ended', async ({ callerId, callId }: EventCallEnded) => {
    const interlocutor = await getUserById(callerId)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit<SocketActions>('call-ended')
    const call = await CallModel.findOneAndUpdate({ _id: callId }, { finishedAt: new Date() })
    if (!call) return
    emitCallDataToInterlocutors(call?.interlocutors, call._id)
  })
}
