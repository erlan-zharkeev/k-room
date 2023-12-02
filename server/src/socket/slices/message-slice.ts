import { MessageModel, ChatRoomModel } from '../../models'
import { io } from '../../server'
import { SocketInstanceType, SocketActions, SocketActionsPayload, Reaction } from '../../@types'
import { setMessage, setMessageStatus, getSocketsByUserIds } from '../helpers'

export const messageSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on(SocketActions.SEND_MESSAGE, async ({ roomId, message }: SocketActionsPayload['sendMessage']) => {
    await setMessage({ roomId, message })
  })

  socket.on(
    SocketActions.CHANGE_MESSAGE_STATUS,
    async ({ messageId, status, roomId }: SocketActionsPayload['changeMessageStatus']) => {
      setMessageStatus(messageId, status, userId, roomId)
    }
  )

  socket.on(SocketActions.DELETE_MESSAGE, async ({ messageId, roomId }: SocketActionsPayload['deleteMessage']) => {
    await MessageModel.findByIdAndDelete({ _id: messageId })
    const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { $pull: { messages: messageId } })
    if (!room) return
    const socketIds = await getSocketsByUserIds(room.users)
    const payload: SocketActionsPayload['messageDeleted'] = { messageId, roomId }
    socketIds.forEach((socketId) => {
      io.to(socketId).emit(SocketActions.MESSAGE_DELETED, payload)
    })
  })

  socket.on(
    SocketActions.ADD_REACTION,
    async ({ glyphKey, messageId, roomId, username }: SocketActionsPayload['addReaction']) => {
      const reaction: Reaction = {
        glyphKey,
        authorId: userId,
        username
      }
      await MessageModel.updateOne({ _id: messageId }, { $push: { reactions: reaction } })
      const room = await ChatRoomModel.findOne({ _id: roomId })
      if (!room) return
      const socketIds = await getSocketsByUserIds(room.users)
      const payload: SocketActionsPayload['updatedMessageReactions'] = { roomId, messageId, reaction }
      socketIds.forEach((socketId) => {
        io.to(socketId).emit(SocketActions.UPDATE_MESSAGE_REACTIONS, payload)
      })
    }
  )
}
