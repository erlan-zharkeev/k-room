import type { EventGetRooms, ChatRoom } from 'global-shared'

export const filterRoomPayloadMessages = ({
  pinnedMessage: _pinnedMessage,
  previewMessage: _previewMessage,
  ...room
}: EventGetRooms[number]): ChatRoom => room
