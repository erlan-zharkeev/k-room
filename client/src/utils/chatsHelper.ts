import { ChatRooms } from 'common-types'

export const getSingleChatIdByUserName = (rooms: ChatRooms, userId: string): string => {
  let roomId = ''
  rooms.forEach((room) => {
    if (room.multiple) return
    room.users.forEach((user) => {
      if (room._id && user.id === userId) roomId = room._id
    })
  })
  return roomId
}
