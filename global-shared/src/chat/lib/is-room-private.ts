import { CHAT_KIND } from '../constants'
import type { ChatRoom } from '../types'

export const isRoomPrivate = (room?: Pick<ChatRoom, 'chatKind'>) => room?.chatKind === CHAT_KIND.DIRECT
