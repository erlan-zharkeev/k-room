import { ChatRoom } from '../../../../types'
import getUserById from './getUserById'

export const getRoomForSaveToUser = async (userId: string, room: ChatRoom) => {
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

export default getRoomForSaveToUser
