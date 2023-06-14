import { ChatRoom } from '../../../../types'
import getUserById from './getUserById'
import { v4 as uuidv4 } from 'uuid'
import constants from './../../constants'

export const getRoomForSaveToUser = async (userId: string, room: ChatRoom, blocked?: boolean) => {
  let { chatName, users, avatar, multiple, authorId, _id } = room

  if (!chatName) chatName = users.find((user) => user.id !== userId)?.username ?? ''

  if (!multiple) {
    const interlocutorId = users.find((user) => user.username === chatName)?.id ?? ''
    const userData = await getUserById(interlocutorId)
    avatar = userData?.avatar
  }

  const filteredUsers = users.filter((user) => user.id !== userId)

  const { multipleChatCreatedAuthorMessage, multipleInviteMessage, singleInviteMessage } = constants

  let messageBody = singleInviteMessage
  if (multiple) {
    messageBody = blocked ? multipleChatCreatedAuthorMessage : multipleInviteMessage
  }

  const inviteMessage = {
    id: uuidv4(),
    status: 'none',
    author: 'system',
    body: messageBody,
    createdAt: ''
  }

  const result = {
    authorId,
    roomId: String(_id),
    chatName,
    avatar,
    hasOnline: false,
    multiple: multiple,
    users: filteredUsers,
    messages: [inviteMessage],
    blocked: blocked ?? false
  }
  return result
}

export default getRoomForSaveToUser
