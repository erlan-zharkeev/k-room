import { IChatRoom } from 'common-types'

export const getChatName = (room: IChatRoom | undefined) => {
  if (room === undefined) return ''
  return room.chatName === '' ? room.users[0].username : room.chatName
}
