import { type LocalizedTextMapType } from 'common'

export const NO_MESSAGES_PLACEHOLDER_I18N = {
  text: {
    en: 'There are no messages, write first',
    ru: 'Сообщений пока нет, напишите первым'
  }
} as const satisfies LocalizedTextMapType
