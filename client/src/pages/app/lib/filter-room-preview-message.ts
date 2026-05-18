import type { EventGetRoomsType, IChatRoom } from 'global-shared'

export const filterRoomPreviewMessage = ({ previewMessage: _, ...room }: EventGetRoomsType[number]): IChatRoom => room
