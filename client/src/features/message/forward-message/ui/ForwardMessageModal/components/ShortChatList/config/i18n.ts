import { type LocalizedTextMapType } from 'common'

export const SHORT_CHAT_LIST_I18N = {
  chooseRoom: {
    en: 'Choose room',
    ru: 'Выберите чат'
  },
  notFound: {
    en: 'Chat rooms not found',
    ru: 'Чаты не найдены'
  }
} as const satisfies LocalizedTextMapType
