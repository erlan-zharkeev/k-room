import { CHAT_KIND, type IChatRoom } from 'global-shared'

export const isRoomGroup = (room: Pick<IChatRoom, 'chatKind'> | undefined) => room?.chatKind === CHAT_KIND.GROUP
