import { APP_LANGUAGE, type AppLanguageType } from 'common'

import type { DbContactType, IDbContactRequiredSystemData } from 'src/shared/config'
import { formatLocalizedRelativeTime } from 'src/shared/lib'

export const lastSeen = (timeStamp: number | undefined, language: AppLanguageType) =>
  timeStamp
    ? language === APP_LANGUAGE.Ru
      ? `был(а) в сети ${formatLocalizedRelativeTime(timeStamp, language)}`
      : `last seen ${formatLocalizedRelativeTime(timeStamp, language)}`
    : ''

export const getContactDescription = (payload: DbContactType, language: AppLanguageType) => {
  const { online, interactionType, lastSeen: timestamp } = payload
  let result

  if (interactionType === 'invite-accepted') {
    result = online ? (language === APP_LANGUAGE.Ru ? 'в сети' : 'online') : lastSeen(timestamp, language)
  }

  return result
}

export const getRequiredContactSystemData = (): IDbContactRequiredSystemData => ({
  onlineStatusSyncedAt: Date.now(),
  isTyping: false
})
