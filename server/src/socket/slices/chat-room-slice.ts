import fs from 'fs'
import { ChatRoomModel } from '../../models'
import { io } from '../../server'
import { SocketInstanceType, SocketActions, SocketActionsPayload, SharpSettingsKey, DBChatRoom } from '../../@types'
import { saveImageAndGetPath, getPathToImg } from '../../utils'
import { setRoomToUsers, emitRoomsByUserId, getUserById, getSocketsByUserIds } from '../helpers'

export const chatRoomSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on(
    SocketActions.CREATE_ROOM,
    async ({ users, multiple, avatarFile, chatName = '' }: SocketActionsPayload['createRoom']) => {
      let avatarPath = ''
      if (avatarFile) avatarPath = await saveImageAndGetPath(avatarFile.buffer, SharpSettingsKey.avatar, userId)
      const room = new ChatRoomModel({
        avatarPath,
        multiple,
        chatName,
        users,
        authorId: userId,
        messages: [],
        blocked: !multiple
      })
      const savedRoom = await room.save()
      await setRoomToUsers(savedRoom.id, users)
      await Promise.all(users.map(async (userId) => await emitRoomsByUserId(userId)))
      const userData = await getUserById(userId)
      if (!userData?.socketId) return
      io.to(userData.socketId).emit(SocketActions.ROOM_CREATED, { roomId: savedRoom.id })
    }
  )

  socket.on(SocketActions.USER_TYPING, async ({ authorName, usersTo, status }: SocketActionsPayload['userTyping']) => {
    const userIds = usersTo.map((user) => user.id)
    const sockets = await getSocketsByUserIds(userIds)
    sockets.forEach((socketId) => {
      const payload: SocketActionsPayload['getUserTypingStatus'] = {
        authorData: { authorName, authorId: userId },
        status
      }
      io.to(socketId).emit(SocketActions.GET_USER_TYPING_STATUS, payload)
    })
  })

  socket.on(
    SocketActions.UPDATE_CHAT_ROOM,
    async ({ roomId, chatName, avatarPath, avatarFile }: SocketActionsPayload['updateChatRoom']) => {
      const isImageExist = fs.existsSync(avatarPath ?? '')
      if (isImageExist) fs.unlinkSync(getPathToImg(avatarPath))
      const updatedAvatar = await saveImageAndGetPath(avatarFile?.buffer, SharpSettingsKey.avatar, userId)
      const room = (await ChatRoomModel.findOneAndUpdate(
        { _id: roomId },
        { avatar: updatedAvatar, chatName }
      )) as DBChatRoom
      if (!room) return
      await Promise.all(room.users.map(async (id) => await emitRoomsByUserId(id)))
      const userData = await getUserById(room.authorId)
      if (!userData?.socketId) return
      io.to(userData?.socketId).emit(SocketActions.ROOM_DATA_UPDATED)
    }
  )
}
