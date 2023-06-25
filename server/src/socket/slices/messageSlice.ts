import { SocketActions, Reaction, SocketActionsPayload } from '../../../../types'
import { UserModel } from '../../models/user.model'
import { io } from '../../server'
import { SocketInstanceType } from '../../types/SocketInstanceType'
import setMessage from '../helpers/setters/setMessage'
import { setMessageStatus } from '../helpers/setters/setMessageStatus'

export const messageSlice = (socket: SocketInstanceType) => {
  socket.on(SocketActions['send-message'], async ({ roomId, message }: SocketActionsPayload['send-message']) => {
    await setMessage({ roomId, message })
  })

  socket.on(
    SocketActions['change-message-status'],
    async ({ messageId, status, userId, roomId, multiple }: SocketActionsPayload['change-message-status']) => {
      setMessageStatus(messageId, status, userId, roomId)
    }
  )

  socket.on(SocketActions['delete-message'], async ({ messageId, roomId }: SocketActionsPayload['delete-message']) => {
    await UserModel.updateMany({ 'chatRooms.roomId': roomId }, { $pull: { 'chatRooms.$.messages': messageId } })
  })
  socket.on(
    SocketActions['add-reaction'],
    async ({ glyphKey, messageId, roomId, authorId, username }: SocketActionsPayload['add-reaction']) => {
      const users = await UserModel.find({ 'chatRooms.roomId': roomId }, 'socketId')
      const reaction: Reaction = {
        glyphKey,
        authorId,
        username
      }
      users.forEach(async (user) => {
        await UserModel.findOneAndUpdate(
          { _id: user.id, 'chatRooms.roomId': roomId },
          { $push: { 'chatRooms.$.messages.$[outer].reactions': reaction } },
          {
            arrayFilters: [{ 'outer.id': messageId }]
          }
        )
        io.to(user.socketId).emit(SocketActions['update-message-reactions'], { roomId, messageId, reaction })
      })
    }
  )
}
