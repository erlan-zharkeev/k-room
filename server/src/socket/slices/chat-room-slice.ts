import fs from 'fs'
import { ChatRoomModel } from '../../models'
import { io } from '../../server'
import {
  SocketInstanceType,
  SocketActions,
  EventCreateRoom,
  EventUserTyping,
  EventGetUserTypingStatus,
  EventUpdateChatRoom
} from '../../@types'
import { saveImageAndGetPath, getPathToImg, checkContactsAccepted } from '../../utils'
import { setRoomToUsers, emitRoomsByUserId, getUserById, getSocketsByUserIds, emitNewRoomToUsers } from '../helpers'
import { setTimeout } from 'timers/promises'

export const chatRoomSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data as { userId: string }
  socket.on<SocketActions>('create-personal-room', async ({ contactId }: EventCreateRoom) => {
    const usersAccepted = checkContactsAccepted(userId, contactId)
    if (!usersAccepted) return
    const users: string[] = [userId, contactId]
    const room = new ChatRoomModel({
      users,
      authorId: userId,
      messages: []
    })
    const savedRoom = await room.save()
    await setRoomToUsers(savedRoom.id, users)
    await emitNewRoomToUsers(users, room)
    await setTimeout(1000)
    io.to(socket.id).emit<SocketActions>('room-created', { roomId: savedRoom.id })
  })

  socket.on<SocketActions>('user-typing', async ({ authorName, usersTo, status }: EventUserTyping) => {
    const userIds = usersTo.map((user) => user.id)
    const sockets = await getSocketsByUserIds(userIds)
    sockets.forEach((socketId) => {
      const payload: EventGetUserTypingStatus = {
        authorData: { authorName, authorId: userId },
        status
      }
      io.to(socketId).emit<SocketActions>('get-user-typing-status', payload)
    })
  })

  socket.on<SocketActions>(
    'update-chat-room',
    async ({ roomId, chatName, avatarPath, avatarFile }: EventUpdateChatRoom) => {
      const isImageExist = fs.existsSync(avatarPath ?? '')
      if (isImageExist) fs.unlinkSync(getPathToImg(avatarPath))
      const updatedAvatar = await saveImageAndGetPath(avatarFile?.buffer, 'avatar', userId)
      const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { avatar: updatedAvatar, chatName })
      if (!room) return
      await Promise.all(room.users.map(async (id) => await emitRoomsByUserId(id)))
      const userData = await getUserById(room.authorId)
      if (!userData?.socketId) return
      io.to(userData?.socketId).emit<SocketActions>('room-data-updated')
    }
  )
}
