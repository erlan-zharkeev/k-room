import { AppLanguageType } from 'common'

import { DbContactType, IDbContactRequiredSystemData } from 'src/shared/config'
import { formatLocalizedRelativeTime } from 'src/shared/lib'

import { CONTACT_SHARED_I18N } from './../config'

export const lastSeen = (timeStamp: number | undefined, language: AppLanguageType) =>
  timeStamp ? `${CONTACT_SHARED_I18N.lastSeen[language]} ${formatLocalizedRelativeTime(timeStamp, language)}` : ''

export const getContactDescription = (payload: DbContactType, language: AppLanguageType) => {
  const { online, interactionType, lastSeen: timestamp } = payload
  let result

  if (interactionType === 'invite-accepted') {
    result = online ? CONTACT_SHARED_I18N.online[language] : lastSeen(timestamp, language)
  }

  return result
}

export const getRequiredContactSystemData = (): IDbContactRequiredSystemData => ({
  savedAt: Date.now(),
  onlineStatusSyncedAt: Date.now(),
  isTyping: false
})
