import { SocketActions, SocketActionsPayload } from '../../../../types'
import { io } from '../../server'
import { SocketInstanceType } from '../../types/SocketInstanceType'
import { getUserById } from '../helpers/getters/getUserById'

export const callSlice = (socket: SocketInstanceType) => {
  socket.on(
    SocketActions['call-user'],
    async ({ signal, userToCall, from, avatarPath, callerName, settings }: SocketActionsPayload['call-user']) => {
      if (!userToCall) return
      const interlocutor = await getUserById(userToCall)
      if (!interlocutor) return
      const payload: SocketActionsPayload['call-user'] = { signal, from, avatarPath, callerName, settings }
      io.to(interlocutor?.socketId).emit(SocketActions['call-user'], payload)
      socket.on(SocketActions['change-call-settings'], (data) => {
        io.to(interlocutor?.socketId).emit(SocketActions['change-call-settings'], data)
      })
    }
  )

  socket.on(
    SocketActions['answer-call'],
    async ({ to, signal, settings, selfSocketId }: SocketActionsPayload['answer-call']) => {
      const interlocutor = await getUserById(to)
      if (!interlocutor) return
      const payload: SocketActionsPayload['call-accepted'] = {
        signal,
        settings
      }
      io.to(interlocutor?.socketId).emit(SocketActions['call-accepted'], payload)
      const sockets = [interlocutor.socketId, selfSocketId]
      sockets.forEach((socketId) => {
        const payload: SocketActionsPayload['call-started-at'] = Date.now()
        io.to(socketId).emit(SocketActions['call-started-at'], payload)
      })
      socket.on(SocketActions['change-call-settings'], (data: SocketActionsPayload['change-call-settings']) => {
        io.to(interlocutor?.socketId).emit(SocketActions['change-call-settings'], data)
      })
    }
  )

  socket.on(SocketActions['call-ended'], async ({ callerId }: SocketActionsPayload['call-ended']) => {
    const interlocutor = await getUserById(callerId)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit(SocketActions['call-ended'])
  })
}
