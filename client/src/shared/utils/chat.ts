import { ChatRoom } from 'common-types'

export const getChatName = (room: ChatRoom | undefined) => {
  if (room === undefined) return ''
  return room.chatName === '' ? room.users[0].username : room.chatName
}
