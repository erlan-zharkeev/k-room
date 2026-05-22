import { CHAT_KIND, type ChatRoom } from 'global-shared'

export const isRoomPrivate = (room?: ChatRoom) => room?.chatKind === CHAT_KIND.DIRECT
