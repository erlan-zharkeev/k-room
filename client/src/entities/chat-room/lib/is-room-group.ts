import { CHAT_KIND, type ChatRoom } from 'global-shared'

export const isRoomGroup = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === CHAT_KIND.GROUP
