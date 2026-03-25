import { type LocalizedTextMapType } from 'common'

export const REPLIED_MESSAGE_I18N = {
  forwarded: {
    en: 'Forwarded',
    ru: 'Переслано'
  },
  replied: {
    en: 'Replied',
    ru: 'Ответ'
  }
} as const satisfies LocalizedTextMapType
