import { ChatRoom } from '../../../../types'
import getUserById from './getUserById'

export const getRoomForSaveToUser = async (userId: string, room: ChatRoom, blocked: boolean) => {
  let chatName = room.chatName
  if (!chatName) chatName = room.users.find((user) => user.id !== userId)?.username ?? ''

  let avatar = room.avatar
  if (!room.multiple) {
    const interlocutorId = room.users.find((user) => user.username === chatName)?.id ?? ''
    const userData = await getUserById(interlocutorId)
    avatar = userData?.avatar
  }

  const users = room.users.filter((user) => user.id !== userId)

  const result = {
    authorId: room.authorId,
    roomId: String(room._id),
    chatName,
    avatar,
    hasOnline: false,
    multiple: room.multiple,
    users,
    messages: room.messages,
    blocked
  }
  return result
}

export default getRoomForSaveToUser
