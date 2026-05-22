import type { KnownUser } from 'global-shared'

import type { KnownUserRecord } from 'src/shared/lib'

export const createKnownUser = ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping = false
}: KnownUser & Partial<Pick<KnownUserRecord, 'isTyping'>>): KnownUserRecord => ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping
})
