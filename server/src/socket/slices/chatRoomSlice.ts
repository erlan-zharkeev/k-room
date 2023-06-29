import { SocketActions, SocketActionsPayload, DBChatRoom } from '../../../../types'
import { ChatRoomModel } from '../../models/chatRoom.model'
import { io } from '../../server'
import { SharpSettingsKey } from '../../types/Constants'
import { SocketInstanceType } from '../../types/SocketInstanceType'
import { getPathToImg } from '../../utils/getPathToImg'
import saveImageAndGetPath from '../../utils/saveImageAndGetPath'
import { emitRoomsByUserId } from '../helpers/emitters'
import { getUserById } from '../helpers/getters/getUserById'
import { getSocketsByUserIds } from '../helpers/getters'
import setRoomToUsers from '../helpers/setters/setRoomToUsers'
import fs from 'fs'

export const chatRoomSlice = (socket: SocketInstanceType) => {
  socket.on(
    SocketActions['create-room'],
    async ({ users, authorId, multiple, avatarFile, chatName = '' }: SocketActionsPayload['create-room']) => {
      let avatarPath = ''
      if (avatarFile) avatarPath = await saveImageAndGetPath(avatarFile.buffer, SharpSettingsKey.avatar, authorId)
      const room = new ChatRoomModel({
        avatarPath,
        multiple,
        chatName,
        users,
        authorId,
        messages: []
      })
      const savedRoom = await room.save()
      await setRoomToUsers(savedRoom.id, users)
      await Promise.all(users.map(async (userId) => await emitRoomsByUserId(userId)))
      const userData = await getUserById(authorId)
      if (!userData?.socketId) return
      io.to(userData.socketId).emit(SocketActions['room-created'], { roomId: savedRoom.id })
    }
  )

  socket.on(
    SocketActions['user-typing'],
    async ({ authorName, authorId, usersTo, status }: SocketActionsPayload['user-typing']) => {
      const userIds = usersTo.map((user) => user.id)
      const sockets = await getSocketsByUserIds(userIds)
      sockets.forEach((socketId) => {
        const payload: SocketActionsPayload['get-user-typing-status'] = { authorData: { authorName, authorId }, status }
        io.to(socketId).emit(SocketActions['get-user-typing-status'], payload)
      })
    }
  )

  socket.on(
    SocketActions['update-chat-room'],
    async ({ roomId, chatName, avatarPath, avatarFile, authorId }: SocketActionsPayload['update-chat-room']) => {
      const isImageExist = fs.existsSync(avatarPath ?? '')
      if (isImageExist) fs.unlinkSync(getPathToImg(avatarPath))
      const updatedAvatar = await saveImageAndGetPath(avatarFile?.buffer, SharpSettingsKey.avatar, authorId)
      const room = (await ChatRoomModel.findOneAndUpdate(
        { _id: roomId },
        { avatar: updatedAvatar, chatName }
      )) as DBChatRoom
      if (!room) return
      await Promise.all(room.users.map(async (id) => await emitRoomsByUserId(id)))
      const userData = await getUserById(room.authorId)
      if (!userData?.socketId) return
      io.to(userData?.socketId).emit(SocketActions['room-data-updated'])
    }
  )
}
