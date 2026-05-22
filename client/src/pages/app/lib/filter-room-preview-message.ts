import type { EventGetRoomsType, ChatRoomType } from 'global-shared'

export const filterRoomPreviewMessage = ({ previewMessage: _, ...room }: EventGetRoomsType[number]): ChatRoomType =>
  room
