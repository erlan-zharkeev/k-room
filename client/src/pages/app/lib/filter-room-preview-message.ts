import type { EventGetRooms, ChatRoom } from 'global-shared'

export const filterRoomPreviewMessage = ({ previewMessage: _, ...room }: EventGetRooms[number]): ChatRoom => room
