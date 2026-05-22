import { CHAT_KIND, type ChatRoomType } from 'global-shared'

export const isRoomGroup = (room?: Pick<ChatRoomType, 'chatKind'>) => room?.chatKind === CHAT_KIND.GROUP
