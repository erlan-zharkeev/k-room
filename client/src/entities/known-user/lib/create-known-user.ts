import type { KnownUser } from 'global-shared'

import type { KnownUserRecord } from 'src/shared/lib'

export const createKnownUser = ({
  avatarId,
  id,
  nickname,
  online,
  lastSeen,
  isTyping = false
}: KnownUser & Partial<Pick<KnownUserRecord, 'isTyping'>>): KnownUserRecord => ({
  avatarId,
  id,
  nickname,
  online,
  lastSeen,
  isTyping
})
