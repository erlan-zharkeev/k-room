import { CHAT_KIND, type IChatRoom } from 'global-shared'

export const isRoomPrivate = (room: IChatRoom | undefined) => room?.chatKind === CHAT_KIND.DIRECT
