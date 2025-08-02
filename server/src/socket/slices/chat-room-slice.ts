import fs from 'fs'
import { ChatRoomModel } from '../../models'
import { io } from '../../server'
import {
  SocketInstanceType,
  SocketActionsType,
  IEventCreateRoom,
  IEventUserTyping,
  IEventGetContactTypingStatus,
  IEventUpdateChatRoom,
  ServerNotificationMessage,
  IChatRoomSchema
} from '../../@types'
import { saveImageAndGetPath, checkContactsAccepted } from '../../utils'
import { setRoomToUsers, getSocketsByUserIds, emitNewRoomToUsers } from '../helpers'
import { setTimeout } from 'timers/promises'
import { throwSocketError } from '../../utils/throw-error'

export const chatRoomSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data as { userId: string }
  socket.on<SocketActionsType>('create-chat-room', async ({ contactIds, chatName, avatarFile }: IEventCreateRoom) => {
    try {
      const usersAccepted = checkContactsAccepted(userId, contactIds)
      if (!usersAccepted) return

      const users: string[] = [userId, ...contactIds]
      const roomData: Omit<IChatRoomSchema, 'id'> = {
        users,
        authorId: userId,
        messages: []
      }
      if (avatarFile) {
        const avatarPath = await saveImageAndGetPath(avatarFile.fileBuffer, 'avatar')
        if (avatarPath) roomData.avatarPath = avatarPath
      }
      if (chatName) {
        roomData.chatName = chatName
      }
      console.log('3')
      const room = new ChatRoomModel(roomData)
      const savedRoom = await room.save()
      await setRoomToUsers(savedRoom.id, users)
      await emitNewRoomToUsers(users, room)
      await setTimeout(1000)
      io.to(socket.id).emit<SocketActionsType>('room-created', { roomId: savedRoom.id })
    } catch (e: unknown) {
      throwSocketError(socket.id, ServerNotificationMessage.RoomCreationError)
    }
  })

  socket.on<SocketActionsType>('client-typing', async ({ usersTo, isTyping }: IEventUserTyping) => {
    const userIds = usersTo.map((user) => user.id)
    const sockets = await getSocketsByUserIds(userIds)
    sockets.forEach((socketId) => {
      const payload: IEventGetContactTypingStatus = {
        contactId: userId,
        isTyping
      }
      io.to(socketId).emit<SocketActionsType>('get-contact-typing-status', payload)
    })
  })

  socket.on<SocketActionsType>(
    'update-chat-room',
    async ({ roomId, chatName, avatarPath, avatarFile }: IEventUpdateChatRoom) => {
      // const isImageExist = fs.existsSync(avatarPath ?? '')
      // if (isImageExist) fs.unlinkSync(getPathToImg(avatarPath))
      // const updatedAvatar = await saveImageAndGetPath(avatarFile?.buffer, 'avatar', userId)
      // const room = await ChatRoomModel.findOneAndUpdate({ _id: roomId }, { avatar: updatedAvatar, chatName })
      // if (!room) return
      // await Promise.all(room.users.map(async (id) => await emitRoomsByUserId(id)))
      // const userData = await getUserById(room.authorId)
      // if (!userData?.socketId) return
      // io.to(userData?.socketId).emit<SocketActionsType>('room-data-updated')
    }
  )
}
