import { MessageModel, ChatRoomModel } from '../../models'
import { io } from '../../server'
import {
  SocketInstanceType,
  SocketActionsType,
  IReaction,
  IEventSendMessage,
  IEventChangeMessageStatus,
  IEventDeleteMessage,
  IEventMessageDeleted,
  IEventAddReaction,
  IEventUpdatedMessageReactions
} from '../../@types'
import { setMessage, setMessageStatus, getSocketsByUserIds } from '../helpers'

export const messageSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data

  socket.on<SocketActionsType>('send-message', async ({ roomId, message }: IEventSendMessage) => {
    try {
      await setMessage({ roomId, message })
    } catch (e: unknown) {
      console.log(e)
    }
  })

  socket.on<SocketActionsType>(
    'change-message-status',
    async ({ messageId, status, roomId }: IEventChangeMessageStatus) => {
      await setMessageStatus(messageId, status, userId, roomId)
    }
  )

  socket.on<SocketActionsType>('delete-message', async ({ messageId, roomId }: IEventDeleteMessage) => {
    await MessageModel.findByIdAndDelete({ _id: messageId })
    const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $pull: { messages: messageId } })
    if (!room) return
    const socketIds = await getSocketsByUserIds(room.users)
    const payload: IEventMessageDeleted = { messageId, roomId }
    socketIds.forEach((socketId) => {
      io.to(socketId).emit<SocketActionsType>('message-deleted', payload)
    })
  })

  socket.on<SocketActionsType>('add-reaction', async ({ glyphKey, messageId, roomId, username }: IEventAddReaction) => {
    const reaction: IReaction = {
      glyphKey,
      authorId: userId,
      username
    }
    try {
      await MessageModel.updateOne({ _id: messageId }, { $push: { reactions: reaction } })
      const room = await ChatRoomModel.findOne({ _id: roomId })
      if (!room) return
      const socketIds = await getSocketsByUserIds(room.users)
      const payload: IEventUpdatedMessageReactions = { roomId, messageId, reaction }
      socketIds.forEach((socketId) => {
        io.to(socketId).emit<SocketActionsType>('message-reaction-updated', payload)
      })
    } catch (e: unknown) {
      console.log(e)
    }
  })
}
