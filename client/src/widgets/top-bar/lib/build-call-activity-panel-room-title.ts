import type { BuildCallActivityPanelRoomTitleParams } from '../config/types'

export const buildCallActivityPanelRoomTitle = ({
  isPrivateRoom,
  room,
  users
}: BuildCallActivityPanelRoomTitleParams) => {
  const privateRoomTitle = isPrivateRoom && users[0]?.nickname

  return room.chatName || privateRoomTitle || ''
}
