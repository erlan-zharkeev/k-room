import type { IBaseFrontendUserData } from 'global-shared'

import type { IDbRoomMemberContact } from 'src/shared/lib'

export const createRoomMemberContact = ({
  id,
  nickname,
  online = false,
  lastSeen = 0
}: IBaseFrontendUserData & Partial<IDbRoomMemberContact>): IDbRoomMemberContact => ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping: false,
  isRoomMember: true
})
