import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { SocketActions, ChatRoom, User, UserShort, Message, MessageStatus } from '../../types'
import { Socket } from 'socket.io'
import { io } from './server'
import { UserModel } from './models/user.model'
import transformUsersToContacts from './utils/transformUsersToContacts'
import { ChatRoomModel } from './models/chatRoom.model'
import { SearchTypeMap } from './types/SearchTypeMap'
import { transformUsersData } from './utils/transformUserData'
import { Messages } from './types/Messages'

const ObjectIdType = require('mongoose').Types.ObjectId

const setSocketId = async (userId: string, socketId: string) => {
  await UserModel.updateOne({ _id: userId }, { $set: { socketId } })
}

const setUserStatus = async (userId: string | typeof ObjectIdType, status: boolean) => {
  await UserModel.updateOne({ _id: userId }, { $set: { online: status } })
  emitUserStatusToAll(userId, true)
}

const setLastSeenData = async (userId: string | typeof ObjectIdType) => {
  await UserModel.updateOne({ _id: userId }, { $set: { lastSeen: Date.now() } })
  emitUserStatusToAll(userId, false)
}

const getUserById = async (userId: string) => await UserModel.findOne({ _id: userId })

const getOnlineUsersByIdsArray = async (users: Array<UserShort>) => {
  const usersArray = users.map((user) => user.id)
  const result = await UserModel.find({
    _id: { $in: usersArray },
    online: true
  })
  return result
}

const getSocketsByUsersArray = async (usersIds: Array<String>) => {
  const users = await UserModel.find({ _id: { $in: usersIds } })
  return users.map((user) => user.socketId)
}

const getUserBySocketId = async (socketId: string) => await UserModel.findOne({ socketId })

const getRoomsByHasContact = async (contactId: string) => await ChatRoomModel.find({ 'users.id': contactId })

const getUsersByHasContactId = async (contactId: string) => await UserModel.find({ contacts: contactId })

const pushMessage = async (data: { roomId: string; message: Message }) => {
  const message = { ...data.message, status: 'delivered' }

  await ChatRoomModel.findOneAndUpdate({ _id: data.roomId }, { $push: { messages: message } }, { new: true })

  const users = await UserModel.find({ 'chatRooms.roomId': data.roomId }, 'socketId')
  users.forEach(async (user) => {
    const updatedMessage = {
      ...message,
      isSelf: user.id === data.message.author
    }
    await UserModel.updateOne(
      { _id: user.id, 'chatRooms.roomId': data.roomId },
      { $push: { 'chatRooms.$.messages': message } }
    )
    io.to(user.socketId).emit(SocketActions.MESSAGE_DELIVERED, { roomId: data.roomId, message: updatedMessage })
  })
}

const changeMessageStatus = async (roomId: string, messageId: string, status: MessageStatus) => {
  await ChatRoomModel.findOneAndUpdate(
    {
      _id: roomId,
      messages: {
        $elemMatch: {
          id: messageId
        }
      }
    },
    {
      $set: {
        'messages.$[outer].status': status
      }
    },
    {
      new: true,
      arrayFilters: [{ 'outer.id': messageId }]
    }
  )
  const users = await UserModel.find({ 'chatRooms.roomId': roomId }, 'socketId')
  users.forEach(async (user) => {
    await UserModel.findOneAndUpdate(
      { _id: user.id, 'chatRooms.roomId': roomId },
      { $set: { 'chatRooms.$.messages.$[outer].status': status } },
      {
        arrayFilters: [{ 'outer.id': messageId }]
      }
    )
    io.to(user.socketId).emit(SocketActions.UPDATE_MESSAGE_STATUS, { roomId, messageId, status })
  })
}

const emitUserStatusToAll = async (userId: string | typeof ObjectIdType, status: boolean) => {
  const roomsByHasContact = await getRoomsByHasContact(userId)
  const usersByHasContactId = await getUsersByHasContactId(userId)

  const usersIdsFromRoom = roomsByHasContact.map((room) => room.users.map((user) => user.id)).flat(Infinity)
  const usersIdsFromUsers = usersByHasContactId.map((user) => user.id)
  const users = [...usersIdsFromRoom, ...usersIdsFromUsers]
  const sockets = await getSocketsByUsersArray(users)

  sockets.forEach((socketId: string) => {
    io.to(socketId).emit(SocketActions.STATUS_CONTACT, { userId, status })
  })
}

const emitContacts = async (userId: string, message?: string) => {
  const userData = await getUserById(userId)
  const matchedUsers = await UserModel.find({ _id: { $in: userData?.contacts } })
  const transformedContacts = transformUsersToContacts(matchedUsers)
  if (userData?.socketId) io.to(userData.socketId).emit(SocketActions.GET_CONTACTS, transformedContacts, message)
}

const emitSearchedContacts = (socketId: string, contacts: Array<User>) => {
  io.to(socketId).emit(SocketActions.GET_SEARCHED_CONTACTS, contacts)
}

const roomForSaveToUser = async (userId: string, room: ChatRoom) => {
  const chatUserNames = room.users.map((user) => {
    if (user.id !== userId) return user.username
  })
  const chatName = chatUserNames.join(`${chatUserNames.length > 2 ? '/' : ''}`)
  let interlocutorId = ''
  room.users.forEach(async (user) => {
    if (user.username === chatName) interlocutorId = user.id
  })
  const userData = await getUserById(interlocutorId)

  const users = room.users
    .map((user) => {
      return { id: user.id, username: user.username }
    })
    .filter((user) => user.id !== userId)

  const result = {
    roomId: String(room._id),
    chatName,
    avatar: userData?.avatar,
    hasOnline: false,
    multiple: room.multiple,
    users,
    messages: []
  }
  return result
}

const saveRoomToUsers = async (room: ChatRoom) => {
  return await Promise.all(
    room.users.map(async (user) => {
      const chatRooms = user.id ? await roomForSaveToUser(user.id, room) : []
      await UserModel.updateOne({ _id: user.id }, { $addToSet: { chatRooms } })
    })
  )
}

const emitRoomsByUserId = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData?.socketId) return

  const rooms = await Promise.all(
    userData.chatRooms.map(async (room) => {
      const onlineUsers = await getOnlineUsersByIdsArray(room.users)
      if (onlineUsers.length > 0) room.hasOnline = true
      room.messages.forEach((message) => {
        message.isSelf = message.author === userId
      })
      return room
    })
  )
  io.to(userData.socketId).emit(SocketActions.GET_ROOMS, rooms)
}

io.on(SocketActions.CONNECTION, (socket: Socket<DefaultEventsMap>) => {
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
    await saveRoomToUsers(room)
    await Promise.all(room.users.map(async (user) => await emitRoomsByUserId(user.id)))
    const userData = await getUserById(chatRoomData.authorId)
    if (!userData?.socketId) return
    io.to(userData.socketId).emit(SocketActions.ROOM_CREATED)
  })

  socket.on(SocketActions.SEND_MESSAGE, async (data: { roomId: string; message: Message }) => {
    await pushMessage(data)
  })

  socket.on(
    SocketActions.CHANGE_MESSAGE_STATUS,
    async (data: { roomId: string; messageId: string; status: MessageStatus }) => {
      const { roomId, messageId, status } = { ...data }
      await changeMessageStatus(roomId, messageId, status)
    }
  )
})
