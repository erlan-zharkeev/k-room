import type { BuildRoomCallActivityTitleParams } from '../config/types'

export const buildRoomCallActivityTitle = ({ isPrivateRoom, room, users }: BuildRoomCallActivityTitleParams) => {
  const privateUserNickname = users[0]?.nickname
  const privateRoomTitle = isPrivateRoom && privateUserNickname

  return room.chatName || privateRoomTitle || ''
}
