import { CHAT_KIND } from '../constants'
import type { ChatRoom } from '../types'

export const isRoomGroup = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === CHAT_KIND.GROUP
