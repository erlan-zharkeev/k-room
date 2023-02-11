import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { SocketActions, ChatRoom, UserShort, Message, MessageStatus } from '../../../types'
import { Socket } from 'socket.io'
import { io } from './../server'
import { UserModel } from './../models/user.model'
import { ChatRoomModel } from './../models/chatRoom.model'
import { SearchTypeMap } from './../types/SearchTypeMap'
import { transformUsersData } from './../utils/transformUserData'
import { Messages } from './../types/Messages'
import emitContacts from './helpers/emitContacts'
import emitRoomsByUserId from './helpers/emitRoomsByUserId'
import emitSearchedContacts from './helpers/emitSearchedContacts'
import getSocketsByUsersArray from './helpers/getSocketsByUsersArray'
import getUserById from './helpers/getUserById'
import getUserBySocketId from './helpers/getUserBySocketId'
import setSocketId from './helpers/setSocketId'
import setMessageStatus from './helpers/setMessageStatus'
import setMessage from './helpers/setMessage'
import setRoomToUsers from './helpers/setRoomToUsers'
import setLastSeenData from './helpers/setLastSeenData'
import setUserStatus from './helpers/setUserStatus'

const ObjectIdType = require('mongoose').Types.ObjectId

io.on(SocketActions.CONNECTION, (socket: Socket<DefaultEventsMap>) => {
  socket.on(SocketActions.CALL_USER, async (data: any) => {
    const interlocutor = await getUserById(data.userToCall)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit(SocketActions.CALL_USER, {
      signal: data.signalData,
      from: data.from,
      avatar: data.avatar,
      callerName: data.callerName,
      settings: data.settings
    })
    socket.on(SocketActions.CHANGE_CALL_SETTINGS, (data) => {
      io.to(interlocutor?.socketId).emit(SocketActions.CHANGE_CALL_SETTINGS, data)
    })
  })

  socket.on(SocketActions.ANSWER_CALL, async (data) => {
    const interlocutor = await getUserById(data.to)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit(SocketActions.CALL_ACCEPTED, {
      signal: data.signal,
      settings: data.settings
    })
    const sockets = [interlocutor.socketId, data.selfSocketId]
    sockets.forEach((socketId) => {
      io.to(socketId).emit(SocketActions.CALL_STARTED_AT, Date.now())
    })
    socket.on(SocketActions.CHANGE_CALL_SETTINGS, (data) => {
      io.to(interlocutor?.socketId).emit(SocketActions.CHANGE_CALL_SETTINGS, data)
    })
  })

  socket.on(SocketActions.CALL_ENDED, async (callerId: any) => {
    const interlocutor = await getUserById(callerId)
    if (!interlocutor) return
    io.to(interlocutor?.socketId).emit(SocketActions.CALL_ENDED)
  })

  socket.on(SocketActions.INITIALIZE, async (userId: string) => {
    io.to(socket.id).emit(SocketActions.CONNECTION)
    await setSocketId(userId, socket.id)
    await emitContacts(userId)
    await emitRoomsByUserId(userId)
    await setUserStatus(userId, true)
  })

  socket.on(SocketActions.DISCONNECT, async () => {
    const userData = await getUserBySocketId(socket.id)
    if (!userData) return
    setUserStatus(userData._id, false)
    setLastSeenData(userData._id)
  })

  socket.on(
    SocketActions.USER_TYPING,
    async (data: { userIdFrom: string; usersTo: Array<UserShort>; status: boolean }) => {
      const userIds = data.usersTo.map((user) => user.id)
      const sockets = await getSocketsByUsersArray(userIds)

      sockets.forEach((socketId) => {
        io.to(socketId).emit(SocketActions.GET_USER_TYPING_STATUS, { userIdFrom: data.userIdFrom, status: data.status })
      })
    }
  )

  socket.on(SocketActions.SEARCH_CONTACT, async (data: { type: string; value: string }) => {
    const { type, value } = { ...data }
    let validSearch = true
    if (type === 'id' && !ObjectIdType.isValid(value)) validSearch = false

    const $regex = new RegExp(value, 'i')

    const searchTypeMap: SearchTypeMap = {
      name: { username: { $regex } },
      email: { email: { $regex } },
      id: { _id: value }
    }

    const searchType = searchTypeMap[type]

    if (!searchType) validSearch = false

    const users = await UserModel.find(searchType)
    const transformedUsers = transformUsersData(users)
    emitSearchedContacts(socket.id, validSearch ? transformedUsers : [])
  })

  socket.on(SocketActions.SAVE_CONTACT, async (data: { userId: string; interlocutorId: string }) => {
    const { userId, interlocutorId } = data
    await UserModel.updateOne({ _id: userId }, { $addToSet: { contacts: interlocutorId } })
    emitContacts(userId, Messages.userAddedToContacts)
  })

  socket.on(SocketActions.DELETE_CONTACT, async (data: { currentUserId: string; deletingUserId: string }) => {
    const { currentUserId, deletingUserId } = data
    await UserModel.updateOne({ _id: currentUserId }, { $pull: { contacts: deletingUserId } })
    emitContacts(currentUserId, Messages.userRemovedFromContacts)
  })

  socket.on(SocketActions.CREATE_ROOM, async (chatRoomData: ChatRoom) => {
    const room = new ChatRoomModel({
      users: chatRoomData.users,
      authorId: chatRoomData.authorId,
      multiple: chatRoomData.users.length > 2
    })
    await room.save()
    await setRoomToUsers(room)
    await Promise.all(room.users.map(async (user) => await emitRoomsByUserId(user.id)))
    const userData = await getUserById(chatRoomData.authorId)
    if (!userData?.socketId) return
    io.to(userData.socketId).emit(SocketActions.ROOM_CREATED)
  })

  socket.on(SocketActions.SEND_MESSAGE, async (data: { roomId: string; message: Message }) => {
    await setMessage(data)
  })

  socket.on(
    SocketActions.CHANGE_MESSAGE_STATUS,
    async (data: { roomId: string; messageId: string; status: MessageStatus }) => {
      const { roomId, messageId, status } = { ...data }
      await setMessageStatus(roomId, messageId, status)
    }
  )
})
