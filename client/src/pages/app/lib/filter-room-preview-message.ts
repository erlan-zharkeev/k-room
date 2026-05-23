import type { EventGetRooms, ChatRoom } from 'global-shared'

export const filterRoomPreviewMessage = ({
  previewMessage: _previewMessage,
  ...room
}: EventGetRooms[number]): ChatRoom => room
