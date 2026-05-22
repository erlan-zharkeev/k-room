import type { KnownUserType } from 'global-shared'

import type { KnownUserRecordType } from 'src/shared/lib'

export const createKnownUser = ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping = false
}: KnownUserType & Partial<Pick<KnownUserRecordType, 'isTyping'>>): KnownUserRecordType => ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping
})
