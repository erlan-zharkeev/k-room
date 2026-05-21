import type { IFrontendKnownUser } from 'global-shared'

import type { DbKnownUserType } from 'src/shared/lib'

export const createKnownUser = ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping = false
}: IFrontendKnownUser & Partial<Pick<DbKnownUserType, 'isTyping'>>): DbKnownUserType => ({
  id,
  nickname,
  online,
  lastSeen,
  isTyping
})
