import { LocalizedTextMapType } from 'common'

export const CONTACT_SHARED_I18N = {
  online: { en: 'online', ru: 'в сети' },
  lastSeen: { en: 'last seen', ru: 'был(а) в сети' }
} as const satisfies LocalizedTextMapType
