import { MessageModel, ChatRoomModel } from '../../models'
import { io } from '../../server'
import {
  SocketInstanceType,
  SocketActions,
  Reaction,
  EventSendMessage,
  EventChangeMessageStatus,
  EventDeleteMessage,
  EventMessageDeleted,
  EventAddReaction,
  EventUpdatedMessageReactions
} from '../../@types'
import { setMessage, setMessageStatus, getSocketsByUserIds } from '../helpers'

export const messageSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data

  socket.on<SocketActions>('send-message', async ({ roomId, message }: EventSendMessage) => {
    try {
      await setMessage({ roomId, message })
    } catch (e: unknown) {
      console.log(e, 'y')
    }
  })

  socket.on<SocketActions>('change-message-status', async ({ messageId, status, roomId }: EventChangeMessageStatus) => {
    await setMessageStatus(messageId, status, userId, roomId)
  })

  socket.on<SocketActions>('delete-message', async ({ messageId, roomId }: EventDeleteMessage) => {
    await MessageModel.findByIdAndDelete({ _id: messageId })
    const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $pull: { messages: messageId } })
    if (!room) return
    const socketIds = await getSocketsByUserIds(room.users)
    const payload: EventMessageDeleted = { messageId, roomId }
    socketIds.forEach((socketId) => {
      io.to(socketId).emit<SocketActions>('message-deleted', payload)
    })
  })

  socket.on<SocketActions>('add-reaction', async ({ glyphKey, messageId, roomId, username }: EventAddReaction) => {
    const reaction: Reaction = {
      glyphKey,
      authorId: userId,
      username
    }
    try {
      await MessageModel.updateOne({ _id: messageId }, { $push: { reactions: reaction } })
      const room = await ChatRoomModel.findOne({ _id: roomId })
      if (!room) return
      const socketIds = await getSocketsByUserIds(room.users)
      const payload: EventUpdatedMessageReactions = { roomId, messageId, reaction }
      socketIds.forEach((socketId) => {
        io.to(socketId).emit<SocketActions>('update-message-reactions', payload)
      })
    } catch (e: unknown) {
      console.log(e)
    }
  })
}
