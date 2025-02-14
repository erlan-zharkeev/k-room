import fs from 'fs'
import { ChatRoomModel } from '../../models'
import { io } from '../../server'
import {
  SocketInstanceType,
  SocketActions,
  DBChatRoom,
  EventCreateRoom,
  EventUserTyping,
  EventGetUserTypingStatus,
  EventUpdateChatRoom
} from '../../@types'
import { saveImageAndGetPath, getPathToImg } from '../../utils'
import { setRoomToUsers, emitRoomsByUserId, getUserById, getSocketsByUserIds } from '../helpers'
import { SharpSettingsKey } from '../../@enums'

export const chatRoomSlice = (socket: SocketInstanceType) => {
  //  !!!!!! TODO ДОБАВИТЬ ПРОВЕРКУ на создание чата и звонок если юзер не accpeted
  const { userId } = socket.data
  socket.on<SocketActions>('create-room', async ({ users, multiple, avatarFile, chatName = '' }: EventCreateRoom) => {
    let avatarPath = ''
    if (avatarFile) avatarPath = await saveImageAndGetPath(avatarFile.buffer, SharpSettingsKey.Avatar, userId)
    const room = new ChatRoomModel({
      avatarPath,
      multiple,
      chatName,
      users,
      authorId: userId,
      messages: []
    })
    const savedRoom = await room.save()
    await setRoomToUsers(savedRoom.id, users)
    await Promise.all(users.map(async (userId) => await emitRoomsByUserId(userId)))
    const userData = await getUserById(userId)
    if (!userData?.socketId) return
    io.to(userData.socketId).emit<SocketActions>('room-created', { roomId: savedRoom.id })
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
      const updatedAvatar = await saveImageAndGetPath(avatarFile?.buffer, SharpSettingsKey.Avatar, userId)
      const room = (await ChatRoomModel.findOneAndUpdate(
        { _id: roomId },
        { avatar: updatedAvatar, chatName }
      )) as DBChatRoom
      if (!room) return
      await Promise.all(room.users.map(async (id) => await emitRoomsByUserId(id)))
      const userData = await getUserById(room.authorId)
      if (!userData?.socketId) return
      io.to(userData?.socketId).emit<SocketActions>('room-data-updated')
    }
  )
}
