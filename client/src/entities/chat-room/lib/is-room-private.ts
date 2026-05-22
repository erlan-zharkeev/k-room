import { CHAT_KIND, type ChatRoomType } from 'global-shared'

export const isRoomPrivate = (room?: ChatRoomType) => room?.chatKind === CHAT_KIND.DIRECT
