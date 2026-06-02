import type { BuildCallStatusRoomTitleParams } from '../config/types'

export const buildCallStatusRoomTitle = ({ isPrivateRoom, room, users }: BuildCallStatusRoomTitleParams) => {
  const privateRoomTitle = isPrivateRoom && users[0]?.nickname

  return room.chatName || privateRoomTitle || ''
}
